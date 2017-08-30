import { createConnection } from "net"
import { inspect } from "util"

import WebSocket from "ws"
import Board from "alekhine"

import getLogger from "./server/logger"

const defaultCount = 20
const socketAddress = "ws://localhost:3000/ws"
const logger = getLogger()

let clients = []

process.on("SIGINT", () => clients.map(c => c.close()))

class Client {
  constructor(name) {
    this.name = name
    this.ws = new WebSocket(socketAddress)

    this.ws.on("open", () => this.send({ action: "join", name }))

    this.ws.on("message", (message) => {
      let command = JSON.parse(message)
      let action, args = {action, ...args}
      logger.info(`Received message for ${name}: ${inspect(command)}`)

      this.dispatch(action, args)
    })
  }

  send(command) {
    logger.info(`Sending command for ${this.name}: ${inspect(command)}`)
    this.ws.send(JSON.stringify(command))
  }

  close() {
    this.ws.close()
  }

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
}

((function simulate(count) {
  checkForServer().then(createClients(count))
}(parseInt(process.argv[2], 10) || defaultCount)))

function checkForServer() {
  return new Promise((resolve, reject) => {
    createConnection(3000, "localhost", resolve)
  })
}

function createClients(count) {
  for (let n = 0; n < count; n++) {
    process.nextTick(() => clients.push(new Client(`Client ${n + 1}`)))
  }
}
