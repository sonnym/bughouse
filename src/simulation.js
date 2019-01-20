import { request } from "http"
import { createConnection } from "net"

import { v4 } from "uuid"
import { forEach } from "ramda"

import { isDevelopment } from "./share/environment"

import WebSocket from "ws"
import Board from "alekhine"

import { logger } from "./app/index"

const clients = []
const clientCount = parseInt(process.argv[2], 10) || 20

process.on("SIGINT", () => forEach(client => {
  try {
    client.close()
  } catch (e) {
    logger.info(e.message)
  }
}, clients))

export default class Client {
  run() {
    this.createUser()
  }

  createUser() {
    this.userData = {
      email: `${v4()}@example.com`,
      password: v4(),
      displayName: v4()
    }

    const postData = JSON.stringify(this.userData)
    const options = {
      method: "POST",
      host: "127.0.0.1",
      port: "3000",
      path: "/users",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(postData)
      }
    }

    const req = request(options, (res) => {
      if (res.statusCode === 201) {
        this.cookie = res.headers["set-cookie"][0].split(";")[0]
        this.connect()
      }
    })

    req.write(postData)
    req.end()
  }

  connect() {
    this.socket = new WebSocket("ws://localhost:3000/ws", {
      headers: { Cookie: this.cookie }
    })

    this.socket.on("open", this.open.bind(this))
    this.socket.on("message", this.message.bind(this))
  }

  open() {
    logger.info("WebSocket [OPEN]")
  }

  message(message) {
    const { action, ...rest } = JSON.parse(message)

    if (action === "universe" || action === "wait") {
      return
    }

    logger.info(`WebSocket [RECV] ${message}`)
    this[action].call(this, rest)
  }

  close() {
    if (this.socket) {
      this.socket.close()
    }
  }

  send(command) {
    const message = JSON.stringify(command)

    this.socket.send(message)
    logger.info(`WebSocket [SEND] ${message}`)
  }

  user({ data }) {
    this.user = data.user
    this.send({ action: "play" })
  }

  start({ data }) {
    this.board = new Board()

    if (data.game.whiteUser.uuid === this.user.uuid) {
      this.color = "w"
    } else if (data.game.blackUser.uuid === this.user.uuid) {
      this.color = "b"
    }

    if (this.color !== this.board.getTurn()) {
      return
    }

    /*
    const pieceFinder = (color, piece) => {
      const ascii = piece.charCodeAt(0)
      return piece !== "" &&
        ((color === "w" &&  ascii > 64 && ascii < 91) ||
         (color === "b" && ascii > 96 && ascii < 123))
    }

    const piecesWithMoves = this.board
      .getState()
      .map(pieceFinder.apply(null, data.color))
      .reduce((memo, piece) => {
        const moves = board.getValidLocations(piece)

        if (moves.length > 0) {
          memo[piece] = moves
        }

        return memo
      })

    // select random piece to move
    // http://stackoverflow.com/questions/2532218/pick-random-property-from-a-javascript-object
    for (let piece in piecesWithMoves) {
      if (Math.random() < 1 / ++count) {
        const from = piece
        const moves = piece_moves[piece]
      }
    }

    const to = moves[Math.floor(Math.random() * moves.length)]
    */

    const from = "", to = "", promotion = ""

    setTimeout(this.send.bind(this, {
      action: "revision",
      from,
      to,
      promotion
    }), 6000 - Math.floor(Math.random() * 1000))

  }
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
    const client = new Client()
    clients.push(client)

    process.nextTick(client.run.bind(client))
  }
}
