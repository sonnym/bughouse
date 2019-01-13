import { createConnection } from "net"
import { inspect } from "util"

import { identity } from "ramda"

import { isDevelopment } from "./share/environment"

import WebSocket from "ws"
import Board from "alekhine"

import Socket from "./client/socket"
import getLogger from "./server/logger"

const clients = []
const clientCount = parseInt(process.argv[2], 10) || 20
const logger = getLogger()

global.WebSocket = WebSocket;
process.on("SIGINT", () => clients.map(c => c.close()))

class Client {
  constructor() {
    const store = {
      commit: () => identity
    }

    this.socket = new Socket(store)
  }
  /*
  dispatch(action, data) {
    if (action !== "game" && action !== "state") {
      return
    }

    let fen = data.center.fen
    let board = new Board()

    board.setFen(fen)

    if (data.color !== board.getTurn()) {
      return
    }

    const pieceFinder = (color, piece) => {
      const ascii = piece.charCodeAt(0)
      return piece !== "" &&
        ((color === "w" &&  ascii > 64 && ascii < 91) ||
         (color === "b" && ascii > 96 && ascii < 123))
    }

    const piecesWithMoves = board
      .getState()
      .map(peiceFinder.apply(null, data.color))
      .reduce((memo, piece) => {
        const moves = board.getValidLocations(piece)

        if (moves.length > 0) {
          memo[piece] = moves
        }

        return memo
      })

    // select random piece to move
    // http://stackoverflow.com/questions/2532218/pick-random-property-from-a-javascript-object
    for (let piece in piece_moves) {
      if (Math.random() < 1/++count) {
        const from = piece
        const moves = piece_moves[piece]
      }
    }

    const to = moves[Math.floor(Math.random() * moves.length)]

    setTimeout(() => {
      this.send({ action: "move", from, to })
    }, 6000 - Math.floor(Math.random() * 1000))
  }
  */
}

if (isDevelopment()) {
  ((function simulate(count) {
    checkForServer().then(createClients())
  }()))
}

function checkForServer() {
  return new Promise((resolve, reject) => {
    createConnection(3000, "localhost", resolve)
  })
}

function createClients() {
  for (let n = 0; n < clientCount; n++) {
    clients.push(new Client())
  }
}
