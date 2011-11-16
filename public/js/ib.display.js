ib.display = (function() {
  var white_pieces = { "K": "&#9812;"
                     , "Q": "&#9813;"
                     , "R": "&#9814;"
                     , "B": "&#9815;"
                     , "N": "&#9816;"
                     , "P": "&#9817;"
                     }
    , black_pieces = { "k": "&#9818;"
                     , "q": "&#9819;"
                     , "r": "&#9820;"
                     , "b": "&#9821;"
                     , "n": "&#9822;"
                     , "p": "&#9823;"
                     }
    , pieces = {}

    , rotating = false;

  $.extend(pieces, black_pieces, white_pieces, {"": "&nbsp;"});

  var color = null;
  this.__defineSetter__("color", function(v) { color = v });

  return {
    update : function(boards, data) {
      for (var b in boards) {
        if (data.states[b]) {
          boards[b].gid = data.states[b].gid;
          boards[b].black = data.states[b].b;
          boards[b].white = data.states[b].w;
          boards[b].stash_b = data.states[b].s_b;
          boards[b].stash_w = data.states[b].s_w;

          boards[b].obj.set_fen(data.states[b].fen, function(message) {
            if (message == "converted") draw_board(boards, b);
          });
        } else {
          boards[b].gid = null
          $("#" + b + " > .board").html("");
          $("#" + b + " > .meta").addClass("hidden");
        }
      }

      return boards;
    }

  , squarify : function() {
      var data_lr = squarify_helper("l")
        , data_c = squarify_helper("c");

      $("#l, #r").css(data_lr.wrapper);
      $("#c").css(data_c.wrapper);

      $("#l .board, #r .board").css(data_lr.board);
      $("#c .board").css(data_c.board);

      $("#l .board .square, #r .board .square").css(data_lr.square);
      $("#c .board .square").css(data_c.square);

    }

  ,  show_hold_dialog : function() {
      $("#hold").dialog({ autoOpen: true
                        , closeText: ""
                        , draggable: false
                        , modal: true
                        , title: "Please Hold"
                        , open: function(event, ui) {
                           $(this).removeClass("hidden");
                          }
                        });
    }

  , draw : function(boards) {
      for (var b in boards) if (boards[b].gid) draw_board(boards, b);
    }

  , display_promotion_dialog : function(turn, callback) {
      $("#promotion").dialog({ autoOpen: true
                             , closeOnEscape: false
                             , closeText: ""
                             , draggable: false
                             , modal: true
                             , title: "Select a Piece"
                             , buttons: { "Ok": function() { $(this).dialog("close"); } }
                             , open: function(event, ui) {
                                $(this).html(get_promotion_pieces(turn));
                                $(this).removeClass("hidden");
                               }
                             , beforeClose: function(event, ui) {
                                 if (!promotion_piece) return false;
                               }
                             , close: function(event, ui) {
                                 callback(promotion_piece);
                                 promotion_piece = null;

                                 $(this).addClass("hidden");
                                 $(this).dialog("destroy");
                               }
                             });
    }

  , rotate : function(data) {
      // prevent any other actions until full rotation is complete
      if (rotating) return;
      rotating = true;

      create_outer_divs(data);

      var direction = data.to;

      if (direction === "l") {
        var operations = ["or", "r", "c", "l", "ol"];
      } else if (direction === "r") {
        var operations = ["ol", "l", "c", "r", "or"];
      }

      var running = 0;
      for (var i = 0, l = operations.length; i < l - 1; i++) {
        var src_id = operations[i];
        var target_id = operations[i + 1];

        var src_wrapper = $("#" + src_id);
        var target_wrapper = $("#" + target_id);
        var wrapper_opts = { width: target_wrapper.css("width"), height: target_wrapper.css("height") };
        if (target_wrapper.css("left") !== "auto") wrapper_opts.left = target_wrapper.css("left");
        if (target_wrapper.css("right") !== "auto") wrapper_opts.right = target_wrapper.css("right");

        running++;
        src_wrapper.animate(wrapper_opts, function() { running-- });

        var src_board = $("#" + src_id + " > .board");
        var target_board = $("#" + target_id + " > .board");
        running++;
        src_board.animate({ height: target_board.css("height")
                          , width: target_board.css("width")
                          , "font-size": target_board.css("font-size")
                          }, function() { running-- });

        var src_squares = $("#" + src_id + " > .board > .square");
        var target_squares = $("#" + target_id + " > .board > .square");
        src_squares.each(function(i, e) {
          var target_square = $(target_squares[i]);
          running++;
          $(e).animate({ height: target_square.css("height")
                       , width: target_square.css("width")
                       }, function() { running-- });
        });
      }

      (function update_board_ids() {
        if (running === 0) {
          if (direction === "l") {
            $("#ol, #l").remove();
            $("#c").attr("id", "l");
            $("#r").attr("id", "c");
            $("#or").attr("id", "r");
          } else if (direction === "r") {
            $("#or, #r").remove();
            $("#c").attr("id", "r");
            $("#l").attr("id", "c");
            $("#ol").attr("id", "l");
          }

          rotating = false;
        } else setTimeout(update_board_ids, 500);
      })();
    }
  };

  function squarify_helper(board_size) {
    // create square and make it a part of the board_size
    var square = document.createElement("div");
    square.setAttribute("id", "calc_square");
    square.setAttribute("class", "square under")
    square.innerHTML = "<div class=\"piece\">" + pieces["b"] + "</div>";

    $("#" + board_size + " > .board").append(square);

    var square_obj = $("#calc_square");

    var meta = $("#" + board_size + " > .meta");
    var max_height = $("#games").height();
    var max_width = $("#" + board_size).width();

    var ck_height = function() { return 8 * square_obj.outerHeight(true) + 2 * meta.outerHeight(true) < max_height };
    var ck_width = function() { return 8 * square_obj.outerWidth(true) < max_width - 30 };

    var length = 0;
    while (ck_height() && ck_width()) {
      length++;

      square_obj.height(length);
      square_obj.width(length);
    }

    square_obj.remove();

    return { square: { width: length
                     , height: length
                     }
           , meta: { width: ((length + 2) * 8) }
           , board: { width: ((length + 2) * 8)
                    , "font-size": Math.round(length) - 8 + "px"
                    }
           , wrapper: { height: ((length + 2) * 8) + (2 * meta.outerHeight(true)) }
           };
  }

  function draw_board(boards, b) {
    $("#" + b + " > .board").html(array2board(boards, b));
    draw_meta(boards, b);

    // no need for periphal boards to have draggable overhead . . .
    if (b != "c") return;

    var pieces = $("#c > .board > .square > .piece")
    pieces.each(function(i, e) {
      // . . . or for oponent's pieces or when it is opponent's turn
      if (get_color_from_piece_div($(pieces[i])) == color && color == boards["c"].obj.get_turn()) {
        $(this).draggable({ revert: "invalid"
                           , start: function(event, ui) {
                               $(".ui-droppable").droppable("destroy");
                               display_moves("c", $(ui.helper[0]), "drag");
                           }
                          });
        $(this).click(function() {
          $(".selected").removeClass("selected");
          $(".droppable").removeClass("droppable");

          var square = $(this).parent().attr("id");
          if (square == selected) selected = null;
          else {
            $(this).parent().addClass("selected");
            selected = square;
            display_moves("c", $(this), "click");
          }
        });
      }
    });
  }

  function array2board(boards, b) {
    var state = boards[b].obj.get_state()
      , line = 0
      , ret = "";

    // since the index of the square acts as an id, simply state.reverse()ing alters the *position* of the pieces,
    // hence the following:  dirty, but operational
    if (!boards[b].flipped) {
      for (var i = 0, l = state.length; i < l; i++) {
        if (i % 8 == 0) {
          ret += "<div class=\"rank_break\"></div>";
          line++;
        }
        ret += board_square((((i + line + 1 % 2) % 2 == 0) ? 'light' : 'dark'), state[i]);
      }
    } else {
      for (var i = state.length - 1; i >= 0; i--) {
        ret += board_square((((i + line + 1 % 2) % 2 == 0) ? 'light' : 'dark'), state[i]);
        if (i % 8 == 0 && i != 0) {
          ret += "<div class=\"rank_break\"></div>";
          line++;
        }
      }
    }

    // add extra rank_break at the end of the board to fix styles
    return ret += "<div class=\"rank_break\"></div>";
  }

  function board_square(color, piece) {
    if (piece == "") return "<div class=\"square " + color + "\">&nbsp;</div>";
    else return "<div class=\"square " + color + "\"><div class=\"piece\">" + pieces[piece] + "<span class=\"hidden\">" + piece + "</span></div></div>";
  }

  function draw_meta(boards, b) {
    var m = $("#" + b + " > .meta")
      , m_f = m.first()
      , m_l = m.last()
      , board = boards[b]
      , message = function(player, stash) { return '<span>' + escape(player) + '</span><span class="stash">' + stash + '</span>'}
      , precedence = ["P", "B", "N", "Q"]
      , stash_w = stash_b = "";

    for (var i = 0, l = precedence.length; i < l; i++) {
      var piece_b = precedence[i]
        , piece_w = String.fromCharCode(parseInt(piece_b.charCodeAt(0)) + 32)
        , re_b = new RegExp(piece_b, "g")
        , re_w = new RegExp(piece_w, "g")
        , match_b = board.stash_b.match(re_b)
        , match_w = board.stash_w.match(re_w);

      if (match_b) for (var j = 0, l_j = match_b.length; j < l_j; j++) stash_b += pieces[piece_b];
      if (match_w) for (var k = 0, l_k = match_w.length; k < l_k; k++) stash_w += pieces[piece_w];
    }

    if (boards[b].flipped) {
      m_f.html(message(board.black, stash_b));
      m_l.html(message(board.white, stash_w));
    } else {
      m_f.html(message(board.white, stash_w));
      m_l.html(message(board.black, stash_b));
    }

    m.removeClass("hidden");
  }

  function create_outer_divs(data) {
    var game_container = $("#games");

    // set board dimensions
    var board_ol = $('<div id="ol" class="hidden"><div class="meta"></div><div class="board"></div><div class="meta"></div></div>');
    var board_or = $('<div id="or" class="hidden"><div class="meta"></div><div class="board"></div><div class="meta"></div></div>');

    board_ol.height(game_container.height());
    board_or.height(game_container.height());

    var width = game_container.width() / 5;
    board_ol.width(width);
    board_or.width(width);

    board_ol.css({ left: (0 - (width + 15)) + "px" });
    board_or.css({ right: (0 - (width + 15)) + "px" });

    // insert boards into games div
    game_container.prepend(board_ol);
    game_container.append(board_or);

    // set up state and draw boards
    var board_obj = new Board();
    board_obj.set_fen(data.state.fen, function() {
      // both boards must be drawn with some state, may as well be what is present
      var boards_assoc = { or: { obj: board_obj } };
      boards_assoc = ib.display.update(boards_assoc, { states: { or: data.state } });
      draw_board(boards_assoc, "or");

      var boards_assoc = { ol: { obj: board_obj } };
      boards_assoc = ib.display.update(boards_assoc, { states: { ol: data.state } });
      draw_board(boards_assoc, "ol");
    });

    board_ol.removeClass("hidden");
    board_or.removeClass("hidden");

    // fix board layouts
    var squarify_results = squarify_helper("ol");
    $("#ol, #or").css(squarify_results.wrapper);
    $("#ol .board, #or .board").css(squarify_results.board);
    $("#ol .board .square, #or .board .square").css(squarify_results.square);
  }

  function display_moves(board, piece, method) {
    var piece_location = get_location_from_piece_div(board, piece)
      , valid = boards[board].obj.get_valid_locations(piece_location)
      , turn = get_color_from_piece_div(piece);

    if ((!DEBUG && turn != color) || valid.length == 0) return;

    for (var i = 0, l = valid.length; i < l; i++) {
      var square = $("#" + board + valid[i]);

      if (method == "drag") {
        square.droppable({ tolerance: "fit"
                         , activeClass: (show_moves) ? "droppable" : ""
                         , hoverClass: "selected"
                         , drop: function(event, ui) { register_move(piece_location, $(this), turn) }
                         });
      } else if (method == "click") {
        if (show_moves) square.addClass("droppable");
        square.click(function() {
          if (selected) register_move(piece_location, $(this), turn);
        });
      }
    }
  }

  function get_color_from_piece_div(d) {
    var ascii = d.children().first().html().charCodeAt(0);
    return (ascii > 64 && ascii < 91) ? "w" : (ascii > 96 && ascii < 123) ? "b" : null;
  }

  function get_promotion_pieces(turn) {
    var pieces = (turn == "w") ? white_pieces : black_pieces
      , piece_keys = $.keys(pieces)
      , ret = "";

    for (var p in piece_keys) {
      var piece = piece_keys[p];
      if (piece.toLowerCase() != "p" && piece.toLowerCase() != "k") ret += "<div class=\"promotion_piece\" id=\"promotion_piece" + piece + "\" onclick=\"ib.toggle_promotion_piece('" + piece + "');\">" + pieces[piece] + "</div>";
    }

    return ret;
  }
})();
