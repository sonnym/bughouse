exports.setUp = function(callback) {
  this.integration = new IntegrationTest();
  this.integration.start_server();
  callback();
}

exports.tearDown = function (callback) {
  this.integration.stop_server();
  callback();
}

exports.can_fetch_index = function(test) {
  this.integration.get("/", function(response) {
    response.on("end", function() {
      test.equal(response.statusCode, 200);
      test.done();
    });
  });
}

module.exports.first_player_to_join_gets_a_hold_message = function(test) {
  var self = this;
  this.integration.ws_handshake({}, function() {
    self.integration.ws_emit("join", join_message());
    self.integration._client._socket.on("message", function(msg) {
      if (msg.type !== "event") return;

      test.equal(msg.name, "hold");
      test.done();
    });
  });
}

module.exports.two_clients_make_a_game = function(test) {
  var client1 = this.integration.add_client()
    , client2 = this.integration.add_client();

  var gid1, gid2 = null;

  client1.ws_handshake({}, function() {
    client1.ws_emit("join", join_message());
    client1._socket.on("message", function(msg1) {
      if (msg1.type === "event" && msg1.name == "game") gid1 = msg1.args[0].gid;
    });
  });

  client2.ws_handshake({}, function() {
    client2.ws_emit("join", join_message());
    client2._socket.on("message", function(msg2) {
      if (msg2.type === "event" && msg2.name == "game") gid2 = msg2.args[0].gid;
    });
  });

  Gourdian.ext.Sync.wait_for(function() { return gid1 && gid2 }, function() {
    test.equal(gid1, gid2);
    test.done();
  });
}

module.exports.player_assigned_white_can_move_and_oppopent_is_notified = function(test) {
  var client1 = this.integration.add_client()
    , client2 = this.integration.add_client();

  var updated_state = null;

  function move_if_white_receive_state_if_black(msg) {
    if (!msg.args) return;

    var data = msg.args[0];

    if (data && data.color && data.color === "w") client1.ws_emit("move", move_message(52, 36));
    if (msg.type === "event" && msg.name == "state") updated_state = data.fen;
  }

  client1.ws_handshake({}, function() {
    client1.ws_emit("join", join_message());
    client1._socket.on("message", move_if_white_receive_state_if_black);
  });

  client2.ws_handshake({}, function() {
    client2.ws_emit("join", join_message());
    client2._socket.on("message", move_if_white_receive_state_if_black);
  });

  Gourdian.ext.Sync.wait_for(function() { return updated_state }, function() {
    test.equal(updated_state, "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1");
    test.done();
  });
}

function join_message(name) {
  return { name: ((name) ? name :  "anonymous") };
}

function move_message(from, to) {
  return { f: from, t: to };
}
