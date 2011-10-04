ClientTest = module.exports = function() {
  IntegrationTest.call(this);

  var join_message = function(name) { return { name: ((name) ? name :  "anonymous") } }
    , move_message = function(from, to) { return { f: from, t: to } };

  var async = this.start();

  this.can_fetch_index = function() {
    this.get("/", function(response) {
      response.on("end", function() {
        assert.equal(response.statusCode, 200);
        async.finish();
      });
    });
  }

  this.first_player_to_join_gets_a_hold_message = function() {
    var self = this;
    this.ws_handshake({}, function() {
      self.ws_emit("join", join_message());
      self._client._socket.on("message", function(msg) {
        if (msg.type !== "event") return;

        assert.equal(msg.name, "hold");
        async.finish();
      });
    });
  }

  this.two_clients_make_a_game = function() {
    var client1 = this.add_client()
      , client2 = this.add_client();

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

    ext.Sync.wait_for(function() { return gid1 && gid2 }, function() {
      assert.equal(gid1, gid2);
      async.finish();
    });
  }

  this.player_assigned_white_can_move_and_oppopent_is_notified = function() {
    var client1 = this.add_client()
      , client2 = this.add_client();

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

    ext.Sync.wait_for(function() { return updated_state }, function() {
      assert.equal(updated_state, "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1");
      async.finish();
    });
  }
}
inherits(ClientTest, IntegrationTest);
