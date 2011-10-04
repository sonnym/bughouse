module.exports = StressTest = function() {
  PerformanceTest.call(this);

  var join_message = function(name) { return { name: ((name) ? name :  "anonymous") } }
    , move_message = function(from, to) { return { f: from, t: to } };

  this.two_players_can_play_a_game = function() {
    var n = 10;
    var clients = [];

    var self = this;

    while (clients.length < n) {
      clients.push(function() {
        var client = self.add_client();

        client.ws_handshake({}, function() {
          client.ws_emit("join", join_message());
          client._socket.on("message", function(msg) {
            move_if_turn(msg, client);
          });
        });

        return client;
      }());
    };

    function move_if_turn(msg, client) {
      if (!msg.args || !msg.args[0]) return;

      var data = msg.args[0];

      if (data.color && data.color === "w" || msg.name === "state") {
        if (data.color) {
          var fen = data.states["c"].fen;
        } else {
          var fen = data.fen;
        }

        ///////////////////////////////////////////////
        // setup
        var board = new Board();
        if (fen) board.set_position(fen);

        // get possible
        var turn = board.get_turn()
          , state = board.get_state()
          , piece_moves = {}
          , pieces = 0
          , piece_finder = function(color, piece) {
              var ascii = piece.charCodeAt(0);
              return piece != "" && ((color == "w" &&  ascii > 64 && ascii < 91) || (color == "b" && ascii > 96 && ascii < 123)) ? true : false;
            };

        for (var i = 0, l = state.length; i < l; i++) {
          var piece = state[i];
          if (piece_finder(turn, piece)) {
            var valid = board.get_valid_locations(i);
            if (valid.length > 0) {
              piece_moves[i] = valid;
              pieces++;
            }
          }
        }

        // select
        if (pieces > 0) {
          var count = 0
            , from = null
            , to = null
            , moves = null;

          // select random piece to move
          // http://stackoverflow.com/questions/2532218/pick-random-property-from-a-javascript-object
          for (var piece in piece_moves) if (Math.random() < 1/++count) {
            from = piece;
            moves = piece_moves[piece];
          }

          to = moves[Math.floor(Math.random() * moves.length)];
        }
        //
        ///////////////////////////////////////////////

        setTimeout(function() {
          client.ws_emit("move", move_message(parseInt(from), to));
        }, 6000 - (Math.floor(Math.random() * 1000)));
      }
    }
  }
}
inherits(StressTest, PerformanceTest);
