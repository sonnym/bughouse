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
    , pieces = {};

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
    }

  , squarify : function() {
      var data_lr = squarify_helper("l")
        , data_c = squarify_helper("c");

      $("#l, #r").css(data_lr.wrapper);
      $("#c").css(data_c.wrapper);

      $("#l .board .square, #r .board .square").css(data_lr.square);
      $("#c .board .square").css(data_c.square);

      $("#l .board, #r .board").css(data_lr.board);
      $("#c .board").css(data_c.board);
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
  };

  function squarify_helper(board_size) {
    // create square and make it a part of the board_size
    var square = document.createElement("div");
    square.setAttribute("id", "calc_square");
    square.setAttribute("class", "square under")
    square.innerHTML = "<div class=\"piece\">" + pieces["b"] + "</div>";

    $("#" + board_size + " > .board").append(square);

    var square_obj = $("#calc_square")
      , piece = square_obj.children(":first-child")
      , size_str = piece.css("font-size")
      , size = parseInt(size_str.substring(0, size_str.length - 2))

    var meta = $("#" + board_size + " > .meta");
    var max_height = $("#games").height();
    var max_width = $("#" + board_size).width();

    var ck_height = function() { return 8 * square_obj.outerHeight(true) < (max_height - (2 * meta.outerHeight(true))) };
    var ck_width = function() { return 8 * square_obj.outerWidth(true) < (max_width - 100) };

    var length = 1;
    while (ck_height() && ck_width()) {
      square_obj.height(length);
      square_obj.width(length);

      length++;
    }

    square_obj.remove();

    return { square: { width: length
                     , height: length
                     , "font-size": (length - 8) + "px"
                     }
           , board: { width: ((length + 2) * 8) }
           , wrapper: { height: ((length + 2) * 8) + (2 * meta.outerHeight(true)) }
           }
  }

  function draw_board(boards, b) {
    $("#" + b + " > .board").html(array2board(boards, b));
    draw_meta(boards, b);

    // no need for periphal boards to have draggable overhead . . .
    if (b != "c") return;

    var pieces = $("#" + b + " > .board > .square > .piece")
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
        ret += board_square((((i + line + 1 % 2) % 2 == 0) ? 'light' : 'dark'), b + i.toString(), state[i]);
      }
    } else {
      for (var i = state.length - 1; i >= 0; i--) {
        ret += board_square((((i + line + 1 % 2) % 2 == 0) ? 'light' : 'dark'), b + i.toString(), state[i]);
        if (i % 8 == 0 && i != 0) {
          ret += "<div class=\"rank_break\"></div>";
          line++;
        }
      }
    }

    // add extra rank_break at the end of the board to fix styles
    return ret += "<div class=\"rank_break\"></div>";
  }

  function board_square(color, id, piece) {
    if (piece == "") return "<div class=\"square " + color + "\" id=\"" + id + "\">&nbsp;</div>";
    else return "<div class=\"square " + color + "\" id=\"" + id + "\"><div class=\"piece\">" + pieces[piece] + "<span class=\"hidden\">" + piece + "</span></div></div>";
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
