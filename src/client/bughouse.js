import Board from 'alekhine'

export default function() {
  DEBUG = false;

  ///////////////////////
  // private variables //

  ///////////////////////
  const boards = { "l" : { flipped: true, gid: null, obj: null, black: "", white: "", stash_b: "", stash_w: "" } // flipped with respect to fen
               , "c" : { flipped: false, gid: null, obj: null, black: "", white: "", stash_b: "", stash_w: "" }
               , "r" : { flipped: true, gid: null, obj: null, black: "", white: "", stash_b: "", stash_w: "" }
               };

  ////////////////////
  // public methods //

  let name = null;
  const selected = null;
  let show_moves = true;
  let promotion_piece = null;
  let socket = null;
  ////////////////////
  return {
    play() {
      init("join");
    }
  , kibitz() {
      init("kibitz");
    }
  , toggle_show_moves(sm) {
      show_moves = sm;
      $(".droppable").removeClass("droppable");
    }
  , toggle_flip_board() {
      boards["l"].flipped = boards["r"].flipped = boards["c"].flipped;
      boards["c"].flipped = !boards["c"].flipped;

      ib.display.draw(boards);
    }
  , toggle_promotion_piece(piece) {
      if (promotion_piece) $(`#promotion_piece${promotion_piece}`).removeClass("promotion_piece_selected");
      $(`#promotion_piece${piece}`).addClass("promotion_piece_selected");

      promotion_piece = piece;
    }
  , redraw_boards() {
      ib.display.draw(boards);
    }
  , head() {
      rotate("h");
    }
  , prev() {
      rotate("l");
    }
  , next() {
      rotate("r");
    }
  , tail() {
      rotate("t");
    }
  };

  /////////////////////
  // private methods //
  /////////////////////

  // initial state

  function init(action) {
    // add ability to get keys from objects
    // http://snipplr.com/view/10430/jquery-object-keys/ => https://groups.google.com/group/jquery-en/browse_thread/thread/3d35ff16671f87a2%5C
    $.extend({ keys(obj) {
                       const a = [];
                       $.each(obj, k => { a.push(k) });
                       return a;
                     }
            });

    // board is required first
    const board = new Board();

    // create and display
    for (const b in boards) boards[b].obj = new Board();

    $("#welcome").remove();

    ib.display.draw(boards);

    // squarify when window is resized, but limit rate
    let resized = false;
    $(window).resize(() => { resized = true });
    (function squarify_if_resized() {
      if (resized) {
        resized = false;
        ib.display.squarify();
      }

      setTimeout(squarify_if_resized, 1);
    })();

    // set name
    name = $("#name").val();
    if (!name) name = "anonymous";

    // open socket
    socket = io.connect(`${window.location.protocol}//${window.location.hostname}`);

    socket.on("connect", response => {
      socket.emit(action, { name });
    });

    socket.on("hold", () => {
      ib.display.show_hold_dialog();
    });

    socket.on("game", data => {
      ib.display.color = data.color;

      if (data.color == "b") {
        ib.toggle_flip_board();
        ib.display.draw(boards); // ?
      }

      const hold = $("#hold");
      if (hold.hasClass("ui-dialog-content")) { // prevent exception when trying to destroy uninitialized dialog
        hold.dialog("destroy");
        hold.addClass("hidden");
      }

      $("#play").removeClass("hidden");
      ib.display.update(boards, data);

      // boards must be drawn at least once first
      ib.display.squarify();
    });

    socket.on("kibitz", data => {
      $("#kibitz").removeClass("hidden");

      ib.display.update(boards, data);
      ib.display.squarify();
    });

    socket.on("rotate", data => {
      if (data.to === "l" || data.to === "r") {
        ib.display.rotate(data);
      } else {
        ib.display.update(boards, data);
        ib.toggle_flip_board();
        ib.display.squarify();
      }
    });

    /*
    socket.on("message", function(data) {
      if (DEBUG) console.log(data);

      // position update
      if (data.state) {
        for (var b in boards) {
          if (boards[b].gid == data.state.gid) {
            boards[b].obj.set_fen(data.state.fen, function(message) {
              if (message == "converted") draw_board(b);
            });
          }
        }
      }
    });
    */
  }

  function rotate(to) {
    socket.emit("rotate", {t: to});
  }

  // moving

  function register_move(from, to_square, turn) {
    const to = parseInt(to_square.attr("id").substring(1));
    boards["c"].obj.update_state( from
                                , to
                                , (message, callback) => {
                                    if (message == "promote") ib.display.promotion_dialog(turn, callback);
                                    else if (message == "complete") {
                                      draw_board(boards, "c");
                                      socket.send({ action: "pos", data: { f: from, t: to } });
                                    }
                                  }
                                );
  }

  // helpers
  function get_location_from_piece_div({length}, d) {
    return parseInt(d.parent()[0].id.substring(length));
  }
}
