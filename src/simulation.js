import path from "path";
import Board from "alekhine";

export function setUp(callback) {
  this.performance = new PerformanceTest();
  this.performance.start_server();
  callback();
}

export function tearDown(callback) {
  this.performance.stop_server();
  callback();
}

export function two_players_can_play_a_game(test) {
  const n = 10;
  const clients = [];

  const self = this;

  while (clients.length < n) {
    clients.push((() => {
      const client = self.performance.add_client();

      client.ws_handshake({}, () => {
        client.ws_emit("join", join_message());
        client._socket.on("message", msg => {
          move_if_turn(msg, client);
        });
      });

      return client;
    })());
  };

  function move_if_turn({args, name}, client) {
    if (!args || !args[0]) return;

    const data = args[0];

    if (data.color && data.color === "w" || name === "state") {
      if (data.color) {
        var fen = data.states["c"].fen;
      } else {
        var fen = data.fen;
      }

      ///////////////////////////////////////////////
      // setup
      const board = new Board();
      if (fen) board.set_fen(fen);

      // get possible
      const turn = board.get_turn();

      const state = board.get_state();
      const piece_moves = {};
      let pieces = 0;

      const piece_finder = (color, piece) => {
            const ascii = piece.charCodeAt(0);
            return piece != "" && ((color == "w" &&  ascii > 64 && ascii < 91) || (color == "b" && ascii > 96 && ascii < 123)) ? true : false;
          };

      for (let i = 0, l = state.length; i < l; i++) {
        var piece = state[i];
        if (piece_finder(turn, piece)) {
          const valid = board.get_valid_locations(i);
          if (valid.length > 0) {
            piece_moves[i] = valid;
            pieces++;
          }
        }
      }

      // select
      if (pieces > 0) {
        let count = 0;
        var from = null;
        var to = null;
        let moves = null;

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

      setTimeout(() => {
        client.ws_emit("move", move_message(parseInt(from), to));
      }, 6000 - (Math.floor(Math.random() * 1000)));
    }
  }
}


function join_message(name) {
  return { name: ((name) ? name :  "anonymous") };
}

function move_message(from, to) {
  return { f: from, t: to };
}
