import Board from 'alekhine'

import Display from './display'
import Socket from './socket'

import logger from "./logger"

const display = Display()
const socket = new Socket()

export default function() {
  // flipped with respect to fen
  let mkBoardState = flipped => {
    return {
      flipped,
      gid: null,
      obj: null,
      black: "",
      white: "",
      stash_b: "",
      stash_w: ""
    }
  }

  const boards = {
    "l" : mkBoardState(true),
    "c" : mkBoardState(false),
    "r" : mkBoardState(true)
  }

  const selected = null
  let show_moves = true
  let promotion_piece = null

  return {
    play() {
      init("join")
    },

    kibitz() {
      init("kibitz")
    },

    toggle_show_moves(sm) {
      show_moves = sm
      $(".droppable").removeClass("droppable")
    },

    toggle_flip_board() {
      boards["l"].flipped = boards["r"].flipped = boards["c"].flipped
      boards["c"].flipped = !boards["c"].flipped

      display.draw(boards)
    },

    toggle_promotion_piece(piece) {
      if (promotion_piece) $(`#promotion_piece${promotion_piece}`).removeClass("promotion_piece_selected")
      $(`#promotion_piece${piece}`).addClass("promotion_piece_selected")

      promotion_piece = piece
    },

    redraw_boards() {
      display.draw(boards)
    },

    head() {
      rotate("h")
    },

    prev() {
      rotate("l")
    },

    next() {
      rotate("r")
    },

    tail() {
      rotate("t")
    }
  }

  /////////////////////
  // private methods //
  /////////////////////

  // initial state

  function init(action) {
    // board is required first
    const board = new Board()

    // set name
    const name = $("#name").val() || "anonymous"

    // create and display
    for (const b in boards) boards[b].obj = new Board()

    $("#welcome").remove()

    display.draw(boards)

    socket.message(message => (({action, ...args}) => {
			logger(`Dispatching ${action} with ${args}`)

      dispatcher[action](args)
    })(JSON.parse(message)))

    socket.send({ action, name })
  }

  const dispatcher = {
    hold: () => {
      display.show_hold_dialog()
    },

    game: (data) => {
      display.color = data.color

      if (data.color == "b") {
        ib.toggle_flip_board()
        display.draw(boards); // ?
      }

      const hold = $("#hold")
      if (hold.hasClass("ui-dialog-content")) { // prevent exception when trying to destroy uninitialized dialog
        hold.dialog("destroy")
        hold.addClass("hidden")
      }

      $("#play").removeClass("hidden")
      display.update(boards, data)

      // boards must be drawn at least once first
      display.squarify()
    },

    kibitz: (data) => {
      $("#kibitz").removeClass("hidden")

      display.update(boards, data)
      display.squarify()
    },

    rotate: (data) => {
      if (data.to === "l" || data.to === "r") {
        display.rotate(data)
      } else {
        display.update(boards, data)
        ib.toggle_flip_board()
        display.squarify()
      }
    }

    /*
    socket.on("message", function(data) {
      // position update
      if (data.state) {
        for (var b in boards) {
          if (boards[b].gid == data.state.gid) {
            boards[b].obj.set_fen(data.state.fen, function(message) {
              if (message == "converted") draw_board(b)
            })
          }
        }
      }
    })
    */
  }

  function rotate(to) {
    socket.send({ action: "rotate", to })
  }

  // moving

  function registerMove(from, to_square, turn) {
    const to = parseInt(to_square.attr("id").substring(1))
    boards["c"].obj.update_state( from
                                , to
                                , (message, callback) => {
                                    if (message == "promote") display.promotion_dialog(turn, callback)
                                    else if (message == "complete") {
                                      draw_board(boards, "c")
                                      socket.send({ action: "position", from, to })
                                    }
                                  }
                                )
  }

  // helpers
  function getLocationFromPieceDiv({length}, d) {
    return parseInt(d.parent()[0].id.substring(length))
  }
}

export const __useDefault = true
