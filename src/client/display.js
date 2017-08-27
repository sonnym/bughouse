export default function() {
  const white_pieces = {
    "K": "&#9812;",
    "Q": "&#9813;",
    "R": "&#9814;",
    "B": "&#9815;",
    "N": "&#9816;",
    "P": "&#9817;"
  }

  const black_pieces = {
    "k": "&#9818;",
    "q": "&#9819;",
    "r": "&#9820;",
    "b": "&#9821;",
    "n": "&#9822;",
    "p": "&#9823;"
  }

  const pieces = {"": "&nbsp;"}
  let rotating = false

  Object.assign(pieces, black_pieces, white_pieces)

  let color = null

  return {
    color(v) { color = v },

    update(boards, {states}) {
      for (const b in boards) {
        if (states[b]) {
          boards[b].gid = states[b].gid
          boards[b].black = states[b].b
          boards[b].white = states[b].w
          boards[b].stash_b = states[b].s_b
          boards[b].stash_w = states[b].s_w

          boards[b].obj.setFen(states[b].fen)

          draw_board(boards, b)
        } else {
          boards[b].gid = null
          $(`#${b} > .board`).html("")
          $(`#${b} > .meta`).addClass("hidden")
        }
      }

      return boards
    },

    squarify() {
      _.each(["l", "r", "c"], loc => {
        const container_width = $(`#${loc}`).width() - 10
        const board = $(`#${loc} .board`)

        if (board.width() > container_width) {
          board.width(container_width)
          board.height(container_width)
        } else {
          board.css({ height: null, width: null })

          if (board.width() > board.height()) {
            board.width(board.height())
          } else {
            board.height(board.width())
          }
        }

        // scale piece size
        const scaler = $(`<div class="hidden">${pieces["b"]}</div>`).appendTo(document.body)

        const square = $(board.children(".square")[0])
        let f_size = 5

        for (const s_w = square.width(), s_h = square.height(); f_size < 100 && scaler.width() < s_w && scaler.height() < s_h; f_size++) {
          scaler.css({ "font-size": f_size })
        }

        board.css({"font-size": f_size})

        scaler.remove()
      })
    },

    show_hold_dialog() {
      $("#hold").dialog({
        autoOpen: true,
        closeText: "",
        draggable: false,
        modal: true,
        title: "Please Hold",
        open(event, ui) {
          $(this).removeClass("hidden")
        }
      })
    },

    draw(boards) {
      for (const b in boards) if (boards[b].gid) draw_board(boards, b)
    },

    display_promotion_dialog(turn, callback) {
      $("#promotion").dialog({
        autoOpen: true,
        closeOnEscape: false,
        closeText: "",
        draggable: false,
        modal: true,
        title: "Select a Piece",
        buttons: { "Ok": function() { $(this).dialog("close"); } },

        open(event, ui) {
          $(this).html(get_promotion_pieces(turn))
          $(this).removeClass("hidden")
        },

        beforeClose(event, ui) {
          if (!promotion_piece) return false
        },

        close(event, ui) {
          callback(promotion_piece)
          promotion_piece = null

          $(this).addClass("hidden")
          $(this).dialog("destroy")
       } })
    },

    rotate(data) {
      // prevent any other actions until full rotation is complete
      if (rotating) return
      rotating = true

      create_outer_divs(data)

      const direction = data.to

      if (direction === "l") {
        var operations = ["or", "r", "c", "l", "ol"]
      } else if (direction === "r") {
        var operations = ["ol", "l", "c", "r", "or"]
      }

      let running = 0
      for (let i = 0, l = operations.length; i < l - 1; i++) {
        const src_id = operations[i]
        const target_id = operations[i + 1]

        const src_wrapper = $(`#${src_id}`)
        const target_wrapper = $(`#${target_id}`)
        const wrapper_opts = { width: target_wrapper.css("width"), height: target_wrapper.css("height") }
        if (target_wrapper.css("left") !== "auto") wrapper_opts.left = target_wrapper.css("left")
        if (target_wrapper.css("right") !== "auto") wrapper_opts.right = target_wrapper.css("right")

        running++
        src_wrapper.animate(wrapper_opts, () => { running-- })

        const src_board = $(`#${src_id} > .board`)
        const target_board = $(`#${target_id} > .board`)
        running++
        src_board.animate({
          height: target_board.css("height"),
          width: target_board.css("width"),
          "font-size": target_board.css("font-size")
        }, () => { running-- })

        const src_squares = $(`#${src_id} > .board > .square`)
        const target_squares = $(`#${target_id} > .board > .square`)
        src_squares.each((i, e) => {
          const target_square = $(target_squares[i])
          running++
          $(e).animate({
            height: target_square.css("height"),
            width: target_square.css("width")
         }, () => { running-- })
        })
      }

      (function update_board_ids() {
        if (running === 0) {
          if (direction === "l") {
            $("#ol, #l").remove()
            $("#c").attr("id", "l")
            $("#r").attr("id", "c")
            $("#or").attr("id", "r")
          } else if (direction === "r") {
            $("#or, #r").remove()
            $("#c").attr("id", "r")
            $("#l").attr("id", "c")
            $("#ol").attr("id", "l")
          }

          rotating = false
        } else setTimeout(update_board_ids, 500)
      })()
    }
  }

  function squarify_helper(board_size) {
    // create square and make it a part of the board_size
    const square = document.createElement("div")
    square.setAttribute("id", "calc_square")
    square.setAttribute("class", "square under")
    square.innerHTML = `<div class="piece">${pieces["b"]}</div>`

    $(`#${board_size} > .board`).append(square)

    const square_obj = $("#calc_square")

    const meta = $(`#${board_size} > .meta`)
    const max_height = $("#games").height()
    const max_width = $(`#${board_size}`).width()

    const ck_height = () => 8 * square_obj.outerHeight(true) + 2 * meta.outerHeight(true) < max_height
    const ck_width = () => 8 * square_obj.outerWidth(true) < max_width - 30

    let length = 0
    while (ck_height() && ck_width()) {
      length++

      square_obj.height(length)
      square_obj.width(length)
    }

    square_obj.remove()

    return {
      square: {
        width: length,
        height: length
      },

      meta: {
        width: ((length + 2) * 8)
      },

      board: {
        width: ((length + 2) * 8),
        "font-size": `${Math.round(length) - 8}px`
      },

      wrapper: { height: ((length + 2) * 8) + (2 * meta.outerHeight(true)) }
    }
  }

  function draw_board(boards, b) {
    $(`#${b} > .board`).html(array2board(boards, b))
    draw_meta(boards, b)

    // no need for periphal boards to have draggable overhead . . .
    if (b != "c") return

    const pieces = $("#c > .board > .square > .piece")
    pieces.each(function(i, e) {
      // . . . or for oponent's pieces or when it is opponent's turn
      if (get_color_from_piece_div($(e)) === color && color === boards["c"].obj.getTurn()) {
        $(this).draggable({
          revert: "invalid",
          start(event, {helper}) {
            $(".ui-droppable").droppable("destroy")
            display_moves(boards.c, $(helper[0]), "drag")
          }
        })

        $(this).click(function() {
          $(".selected").removeClass("selected")
          $(".droppable").removeClass("droppable")

          const square = $(this).parent().attr("id")
          if (square == selected) selected = null
          else {
            $(this).parent().addClass("selected")
            selected = square
            display_moves(boards.c, $(this), "click")
          }
        })
      }
    })
  }

  function array2board(boards, b) {
    const state = boards[b].obj.getState()
    let line = 0
    let ret = ""

    // since the index of the square acts as an id, simply state.reverse()ing alters the *position* of the pieces,
    // hence the following:  dirty, but operational
    if (!boards[b].flipped) {
      for (var i = 0, l = state.length; i < l; i++) {
        if (i % 8 == 0) {
          ret += "<div class=\"rank_break\"></div>"
          line++
        }

        ret += board_square(squareName(i), state[i])
      }

    } else {
      for (var i = state.length - 1; i >= 0; i--) {
        ret += board_square(squareName(i), state[i])

        if (i % 8 == 0 && i != 0) {
          ret += "<div class=\"rank_break\"></div>"
          line++
        }
      }
    }

    // add extra rank_break at the end of the board to fix styles
    return ret += "<div class=\"rank_break\"></div>"
  }

  function board_square(name, piece) {
    if (piece == "") {
      return `<div class="square">&nbsp;</div>`
    } else {
      return `<div class="square" data-square="${name}"><div class="piece">${pieces[piece]}<span class="hidden">${piece}</span></div></div>`
    }
  }

  function squareName(n) {
    return `${String.fromCharCode((n % 8) + 97)}${8 - (~~(n / 8))}`
  }

  function draw_meta(boards, b) {
    const m = $(`#${b} > .meta`)
    const m_f = m.first()
    const m_l = m.last()
    const board = boards[b]
    const message = (player, stash) => `<span>${escape(player)}</span><span class="stash">${stash}</span>`
    const precedence = ["P", "B", "N", "Q"]

    let stash_w = ""
    let stash_b = ""

    for (let i = 0, l = precedence.length; i < l; i++) {
      const piece_b = precedence[i]
      const piece_w = String.fromCharCode(parseInt(piece_b.charCodeAt(0)) + 32)
      const re_b = new RegExp(piece_b, "g")
      const re_w = new RegExp(piece_w, "g")
      const match_b = (board.stash_b || "").match(re_b)
      const match_w = (board.stash_w || "").match(re_w)

      if (match_b) for (let j = 0, l_j = match_b.length; j < l_j; j++) stash_b += pieces[piece_b]
      if (match_w) for (let k = 0, l_k = match_w.length; k < l_k; k++) stash_w += pieces[piece_w]
    }

    if (boards[b].flipped) {
      m_f.html(message(board.black, stash_b))
      m_l.html(message(board.white, stash_w))
    } else {
      m_f.html(message(board.white, stash_w))
      m_l.html(message(board.black, stash_b))
    }

    m.removeClass("hidden")
  }

  function create_outer_divs({state}) {
    const game_container = $("#games")

    // set board dimensions
    const board_ol = $('<div id="ol" class="hidden"><div class="meta"></div><div class="board"></div><div class="meta"></div></div>')
    const board_or = $('<div id="or" class="hidden"><div class="meta"></div><div class="board"></div><div class="meta"></div></div>')

    board_ol.height(game_container.height())
    board_or.height(game_container.height())

    const width = game_container.width() / 5
    board_ol.width(width)
    board_or.width(width)

    board_ol.css({ left: `${0 - (width + 15)}px` })
    board_or.css({ right: `${0 - (width + 15)}px` })

    // insert boards into games div
    game_container.prepend(board_ol)
    game_container.append(board_or)

    // set up state and draw boards
    const board_obj = new Board()
    board_obj.setFen(state.fen, () => {
      // both boards must be drawn with some state, may as well be what is present
      var boards_assoc = { or: { obj: board_obj } }
      boards_assoc = ib.display.update(boards_assoc, { states: { or: state } })
      draw_board(boards_assoc, "or")

      var boards_assoc = { ol: { obj: board_obj } }
      boards_assoc = ib.display.update(boards_assoc, { states: { ol: state } })
      draw_board(boards_assoc, "ol")
    })

    board_ol.removeClass("hidden")
    board_or.removeClass("hidden")

    // fix board layouts
    const squarify_results = squarify_helper("ol")
    $("#ol, #or").css(squarify_results.wrapper)
    $("#ol .board, #or .board").css(squarify_results.board)
    $("#ol .board .square, #or .board .square").css(squarify_results.square)
  }

  function display_moves(board, piece, method) {
    const squareName = piece.parent().attr("data-square")
    const valid = board.obj.getValidLocations(squareName)
    const turn = get_color_from_piece_div(piece)

    if (turn !== color || valid.length == 0) return

    for (let i = 0, l = valid.length; i < l; i++) {
      const square = $(`#${board}${valid[i]}`)

      if (method === "drag") {
        square.droppable({
          tolerance: "fit",
          activeClass: (show_moves) ? "droppable" : "",
          hoverClass: "selected",
          drop(event, ui) { register_move(piece_location, $(this), turn) }
        })
      } else if (method == "click") {
        if (show_moves) square.addClass("droppable")
        square.click(function() {
          if (selected) register_move(piece_location, $(this), turn)
        })
      }
    }
  }

  function get_color_from_piece_div(d) {
    const ascii = d.children().first().html().charCodeAt(0)
    return (ascii > 64 && ascii < 91) ? "w" : (ascii > 96 && ascii < 123) ? "b" : null
  }

  function get_promotion_pieces(turn) {
    const pieces = (turn == "w") ? white_pieces : black_pieces
    const piece_keys = $.keys(pieces)
    let ret = ""

    for (const p in piece_keys) {
      const piece = piece_keys[p]
      if (piece.toLowerCase() != "p" && piece.toLowerCase() != "k") ret += `<div class="promotion_piece" id="promotion_piece${piece}" onclick="ib.toggle_promotion_piece('${piece}');">${pieces[piece]}</div>`
    }

    return ret
  }
}

export const __useDefault = true
