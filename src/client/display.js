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
    "after": "&#9820;",
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

          drawBoard(boards, b)
        } else {
          boards[b].gid = null
          $(`#${b} > .board`).html("")
          $(`#${b} > .meta`).addClass("hidden")
        }
      }

      return boards
    },

    showHoldDialog() {
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
      for (const b in boards) if (boards[b].gid) drawBoard(boards, b)
    },

    displayPromotionDialog(turn, callback) {
      $("#promotion").dialog({
        autoOpen: true,
        closeOnEscape: false,
        closeText: "",
        draggable: false,
        modal: true,
        title: "Select a Piece",
        buttons: { "Ok": function() { $(this).dialog("close"); } },

        open(event, ui) {
          $(this).html(getPromotionPieces(turn))
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
  }

  function drawBoard(boards, b) {
    if (boards[b].flipped) {
      $(`#${b} > .board`).addClass("flipped");
    } else {
      $(`#${b} > .board`).removeClass("flipped");
    }

    $(`#${b} > .board`).html(array2board(boards[b]))
    drawMeta(boards, b)

    // no need for periphal boards to have draggable overhead . . .
    if (b !== "center") return

    const pieces = $("#game > .board > .square > .piece")
    pieces.each(function(i, e) {
      // . . . or for oponent's pieces or when it is opponent's turn
      if (getColorFromPieceDiv($(e)) === color && color === boards["center"].obj.getTurn()) {
        $(this).draggable({
          revert: "invalid",
          start(event, {helper}) {
            $(".ui-droppable").droppable("destroy")
            displayMoves(boards.c, $(helper[0]), "drag")
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
            displayMoves(boards.c, $(this), "click")
          }
        })
      }
    })
  }

  function array2board(board) {
    const flipped = board.flipped
    const state = board.obj.getState()

    return state.reduce((ret, content, i) => {
      if (i % 8 === 0 && i !== 0) {
        ret += '</div><div class="rank">'
      }

      return ret + boardSquare(squareName(i), content)
    }, '<div class="rank">') + "</div>"
  }

  function boardSquare(name, piece) {
    if (piece == "") {
      return `<div class="square">&nbsp;</div>`
    } else {
      return `<div class="square" data-square="${name}"><div class="piece">${pieces[piece]}<span class="hidden">${piece}</span></div></div>`
    }
  }

  function squareName(n) {
    return `${String.fromCharCode((n % 8) + 97)}${8 - (~~(n / 8))}`
  }

  function drawMeta(boards, b) {
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

  function displayMoves(board, piece, method) {
    const squareName = piece.parent().attr("data-square")
    const valid = board.obj.getValidLocations(squareName)
    const turn = getColorFromPieceDiv(piece)

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

  function getColorFromPieceDiv(d) {
    const ascii = d.children().first().html().charCodeAt(0)
    return (ascii > 64 && ascii < 91) ? "w" : (ascii > 96 && ascii < 123) ? "b" : null
  }

  function getPromotionPieces(turn) {
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
