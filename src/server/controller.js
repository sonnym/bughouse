import _ from "underscore";

const BughouseController = module.exports = function() {
  Gourdian.Controller.call(this);
};
inherits(BughouseController, Gourdian.Controller);

BughouseController.prototype.join = function() {
  const name = this._message.name;
  const data = Bughouse.join(this._socket.id, name);

  if (!data) {
    Gourdian.Logger.info(`user with name ${name} joined; held`);
    this._socket.emit("hold");

  } else {
    const gid = data.gid;
    const color = data[this._socket.id];
    const opp_id = data.opp;
    const opp_color = color == "w" ? "b" : "w";

    Gourdian.Logger.info(`user with name ${name}, this._socket_id ${this._socket.id} joined; assigned: ${color}; opponent: ${opp_id} ${opp_color}`);

    this._socket.emit("game", {gid, color, states: data.states});
    this._sockets[opp_id].emit("game", {gid, color: opp_color, states: data.states});
  }
}

BughouseController.prototype.move = function() {
  const from = this._message.f;
  const to = this._message.t;
  const self = this;

  Bughouse.update(this._socket.id, from, to, data => {
    if (!data) return; // client disconnected during an update

    const gid = data.gid;
    const opp_id = data.opp_id;
    const watchers = data.watchers;

    self._sockets[opp_id].emit("state", data.state);

    for (let i = 0, l = watchers.length; i < l; i++) {
      const watcher = self._sockets[watchers[i]];
      if (watcher) watcher.emit("state", data.state);
    }

    Gourdian.Logger.info(`recieved move from client with socket id: ${self._socket.id}; from ${from} to ${to}; opp ${opp_id}`);
  });
}

BughouseController.prototype.kibitz = function() {
  const states = Bughouse.kibitz(this._socket.id, this._message.name);
  this._socket.emit("kibitz", { states });
}

BughouseController.prototype.rotate = function() {
  const data = Bughouse.mv_watcher(this._socket.id, this._message.t);
  this._socket.emit("rotate", _.extend(data, { to: this._message.t }));
}

BughouseController.prototype.disconnect = ({sessionId}) => {
  Bughouse.quit(sessionId);
};
