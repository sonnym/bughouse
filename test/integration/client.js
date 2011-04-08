require("util").inherits(module, require("./../../core/integration_test"));
ClientTest = module.exports = function() { 
  var http = require("http")
    , player = require("./../lib/player")
    , WebSocket = require("node-websocket-client/lib/websocket").WebSocket

    , join_message = function(name) { return { action: "join", data: { name: ((name) ? name :  "anonymous") } } }
    , move_message = function(from, to) { return { action: "pos", data: { f: from, t: to } } };

  return {
    can_fetch_index: function() {
      var client_http = http.createClient(8124)
        , request = client_http.request("GET", "/");

      var assertion = gourdian.curriedRequestOn(request, function(response) {
        assert.equal(response.statusCode, 200);
      });

      request.end();

      return assertion;

    }, can_connect_via_websocket: function() {
      var client = new WebSocket("ws://127.0.0.1:8124/socket.io/websocket", "borf");

      return gourdian.curriedWebsocketAddListener(client, function(buffer) {
        assert.notEqual(buffer.length, 0);
      });

    // async tests beyond this point do not work yet, but can be verified via the log files
    }, first_player_to_join_gets_a_hold_message: function() {
      var client = new WebSocket("ws://127.0.0.1:8124/socket.io/websocket", "borf")
        , message = { action: "join", data: { name: "anonymous" } }
        , receipt = { hold: 1};

      client.onopen = function() { socket_send(client_sock, "j", message) };

      return gourdian.curriedWebsocketOnMessage(client, function(message) {
        var obj = message_parse(message);
        if (obj.hold) {
          assert.equal(true,false);
          assert.deepEqual(obj, receipt);
        }
      });

    }, two_clients_make_a_game: function() {
      var client_sock = new WebSocket("ws://127.0.0.1:8124/socket.io/websocket", "borf")
        , client_sock2 = new WebSocket("ws://127.0.0.1:8124/socket.io/websocket", "borf");

      client_sock.onopen = function() { socket_send(client_sock, "j", join_message()) };
      client_sock2.onopen = function() { socket_send(client_sock2, "j", join_message()) };

    }, player_assigned_white_can_move: function() {
      var client_sock = new WebSocket("ws://127.0.0.1:8124/socket.io/websocket", "borf")
        , client_sock2 = new WebSocket("ws://127.0.0.1:8124/socket.io/websocket", "borf");

      // join
      client_sock.onopen = function() { socket_send(client_sock, "j", join_message()) };
      client_sock2.onopen = function() { socket_send(client_sock2, "j", join_message()) };

      // play
      client_sock.onmessage = client_sock2.onmessage = function(m) {
        var obj = message_parse(m);
        if (!obj.color || obj.color != "w") return;

        socket_send(this, "j", move_message(52, 36));
      }

    }, two_players_can_play_a_game: function() {
      n_players_can_play(2);

    }, twenty_players_can_play: function() {
      n_players_can_play(20);
    }
  };

  // helpers
  function n_players_can_play(n) {
    var clients = [];

    while (clients.length < n) {
      clients.push(function(num) {
        var client_sock = new WebSocket("ws://127.0.0.1:8124/socket.io/websocket", "borf")

        client_sock.onopen = function() { socket_send(client_sock, "j", join_message("client" + parseInt(num))) };

        // play
        client_sock.onmessage = function(m) {
          if (m.data.substr(7,3) == "~h~") {
            socket_send(this, "h", m.data.substr(10));
            return;
          }

          var obj = message_parse(m)
            , sock = this
            , fen = null;

          if ((obj.play && obj.color == "w") || obj.state) {
            if (obj.play) {
              fen = obj.states["c"].fen;
            } else if (obj.state) {
              fen = obj.state.fen;
            }

            player.move(fen, function(from, to) {
              setTimeout(socket_send, 2000 - (Math.floor(Math.random() * 1000)), sock, "j", move_message(from, to));
            });
          }
        }
      }(clients.length));
    }
  }

  function socket_send(c, t, o) {
    var m = (t == "j") ? JSON.stringify(o) : o;
    c.send("~m~" + (m.length + 3) + "~m~~" + t + "~" + m);
  }

  function message_parse(m) {
    var parsed = m.data.substring(3)
      , m_len_end = parsed.indexOf("~")
      // , m_len = parsed.substring(m_len_end) // unused
      , parsed = parsed.substring(m_len_end + 6);

    return eval("(" + parsed + ")"); // assume json
  }
}
