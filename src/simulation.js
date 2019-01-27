import { request } from "http"
import { createConnection } from "net"

import { v4 } from "uuid"
import { forEach, pick } from "ramda"

import { isDevelopment } from "./share/environment"

import WebSocket from "ws"
import { Chess } from "chess.js"

import { logger } from "./app/index"
import { REVISION_TYPES } from "./share/constants"

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

  user({ user }) {
    this.user = user
    this.send({ action: "play" })
  }

  start({ game, opponent }) {
    this.game = game
    this.chess = new Chess()

    if (game.whiteUser.uuid === this.user.uuid) {
      this.color = this.chess.WHITE
    } else if (game.blackUser.uuid === this.user.uuid) {
      this.color = this.chess.BLACK
    }

    if (this.color === this.chess.turn()) {
      this.move()
    }
  }

  position({ game, position }) {
    if (this.game.uuid !== game.uuid) {
      return
    }

    this.chess.load(position.fen)

    if (this.color === this.chess.turn()) {
      this.move()
    }
  }

  move() {
    const moves = this.chess.moves({ verbose: true })
    const move = moves[Math.floor(Math.random() * moves.length)]

    if (move.piece === this.chess.PAWN && move.to.match(/1|8/)) {
      move.promotion = [
        this.chess.KNIGHT,
        this.chess.BISHOP,
        this.chess.ROOK,
        this.chess.QUEEN
      ][Math.floor(Math.random() * 4)]
    }

    setTimeout(this.send.bind(this, {
      action: "revision",
      type: REVISION_TYPES.MOVE,
      ...pick(["from", "to", "promotion"], move)
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
