module.exports = BughouseController = function() {
  Controller.call(this);
}
inherits(BughouseController, Controller);

BughouseController.prototype.join = function() {
  var name = this._message.name
    , data = BughouseModel.join(this._socket.id, name);

  if (!data) {
    Logger.info("user with name " + name + " joined; held");
    this._socket.emit("hold");

  } else {
    var gid = data.gid
      , color = data[this._socket.id]

      , opp_id = data.opp
      , opp_color = color == "w" ? "b" : "w";

    Logger.info("user with name " + name + ", this._socket_id " + this._socket.id + " joined; assigned: " + color + "; opponent: " + opp_id + " " + opp_color);

    this._socket.emit("game", {gid: gid, color: color, states: data.states});
    this._sockets[opp_id].emit("game", {gid: gid, color: opp_color, states: data.states});
  }
}

BughouseController.prototype.move = function() {
  var from = this._message.f
    , to = this._message.t
    , self = this;

  BughouseModel.update(this._socket.id, from, to, function(data) {
    if (!data) return; // client disconnected during an update

    var gid = data.gid
      , opp_id = data.opp_id
      , watchers = data.watchers;

    self._sockets[opp_id].emit("state", data.state);

    for (var i = 0, l = watchers.length; i < l; i++) {
      var watcher = self._sockets[watchers[i]];
      if (watcher) watcher.emit("state", data.state);
    }

    Logger.info("recieved move from client with socket id: " + self._socket.id + "; from " + from + " to " + to + "; opp " + opp_id);
  });
}

BughouseController.prototype.kibitz = function() {
  var states = BughouseModel.kibitz(this._socket.id, this._message.name);
  this._socket.emit("kibitz", { states: states });
}

BughouseController.prototype.rotate = function() {
  var data = BughouseModel.mv_watcher(this._socket.id, this._message.t);
  this._socket.emit("rotate", _.extend(data, { to: this._message.t }));
}

BughouseController.prototype.disconnect = function(client) {
  BughouseModel.quit(client.sessionId);
};
