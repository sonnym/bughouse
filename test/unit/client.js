var assert = require("assert")
  , http = require("http")
  , player = require("./../lib/player")
  , sys = require("sys")
  , WebSocket = require("node-websocket-client/lib/websocket").WebSocket

  , client_http = http.createClient(8124)

  , join_message = function(name) { return { action: "join", data: { name: ((name) ? name :  "anonymous") } } }
  , move_message = function(from, to) { return { action: "pos", data: { f: from, t: to } } };

exports.can_fetch_index = function() {
  var request = client_http.request("GET", "/");

  request.end();
  request.on("response", function(response) {
    assert.equal(response.statusCode, 200);
  });
}

exports.can_connect_via_websocket = function() {
  /*
  var client_sock = new WebSocket("ws://127.0.0.1:8124/socket.io/websocket", "borf");

  client_sock.addListener('data', function(buf) {
    assert.notEqual(buf.length, 0);
  });
  */
}

 // WARNING
// async tests do not work yet, but can be verified from logs
/*
exports.can_join_game = function() {
  var client_sock = new WebSocket("ws://127.0.0.1:8124/socket.io/websocket", "borf")
    , message_sent = false
    , message = { action: "join", data: { name: "anonymous" } }
    , receipt = { hold: 1};

  client_sock.onopen = function() { socket_send(client_sock, "j", message) };

  client_sock.onmessage = function(m) {
    var obj = message_parse(m);
    if (obj.hold) {
      assertEqual(obj, receipt);
    }
  }
}

exports.two_clients_make_a_game = function() {
  var client_sock = new WebSocket("ws://127.0.0.1:8124/socket.io/websocket", "borf")
    , client_sock2 = new WebSocket("ws://127.0.0.1:8124/socket.io/websocket", "borf");

  client_sock.onopen = function() { socket_send(client_sock, "j", join_message()) };
  client_sock2.onopen = function() { socket_send(client_sock2, "j", join_message()) };
}

exports.player_assigned_white_can_move = function() {
  var client_sock = new WebSocket("ws://127.0.0.1:8124/socket.io/websocket", "borf")
    , client_sock2 = new WebSocket("ws://127.0.0.1:8124/socket.io/websocket", "borf");

  // join
  client_sock.onopen = function() { socket_send(client_sock, "j", join_message()) };
  client_sock2.onopen = function() { socket_send(client_sock2, "j", join_message()) };

  // play
  client_sock.onmessage = client_sock2.onmessage = function(m) {
    var obj = message_parse(m);
    if (!obj.color || obj.color != "w") return;

    socket_send(this, "j", update_position_message("rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq e3 0 1"));
  }
}

exports.two_players_can_play_a_game = function() {
  var client_sock = new WebSocket("ws://127.0.0.1:8124/socket.io/websocket", "borf")
    , client_sock2 = new WebSocket("ws://127.0.0.1:8124/socket.io/websocket", "borf");

  // join
  client_sock.onopen = function() { socket_send(client_sock, "j", join_message()) };
  client_sock2.onopen = function() { socket_send(client_sock2, "j", join_message()) };

  // play
  client_sock.onmessage = client_sock2.onmessage = function(m) {
    // thanks to miksago for the following
    if (m.data.substr(7,3) == "~h~") socket_send(this, "h", m.data.substr(10));

    var obj = message_parse(m)
      , sock = this;

    if (obj.color && obj.color == "w") {
      socket_send(sock, "j", update_position_message("rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq e3 0 1"));
    } else if (obj.fen) {
      player.move( obj.fen
                 , function(from, to) {
                    socket_send(sock, "j", move_message(from, to));
                   }
                 );
    }
  }
}
*/

exports.twenty_players_can_play = function() {
  var clients = [];

  while (clients.length < 20) {
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

          player.move( fen
                      , function(from, to) {
                          setTimeout(socket_send, 2000 - (Math.floor(Math.random() * 1000)), sock, "j", move_message(from, to));
                          //socket_send(sock, "j", move_message(from, to));
                        }
                      );
        }
      }
    }(clients.length));
  }
}

// helpers
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
