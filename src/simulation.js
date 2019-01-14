import { request } from "http"
import { createConnection } from "net"

import { v4 } from "uuid"
import { forEach } from "ramda"

import { isDevelopment } from "./share/environment"

import WebSocket from "ws"
// import Board from "alekhine"

// import getLogger from "./server/logger"

const clients = []
const clientCount = parseInt(process.argv[2], 10) || 20
// const logger = getLogger()

process.on("SIGINT", () => forEach(client => {
  try {
    client.close()
  } catch (e) {
    console.log(e.message)
  }
}, clients))

class Client {
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
    console.log("WebSocket [OPEN]")
  }

  message(event) {
    console.log(`WebSocket [RECV] ${event}`)
  }

  close() {
    if (this.socket) {
      this.socket.close()
    }
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
    const client = new Client()
    clients.push(client)

    process.nextTick(client.run.bind(client))
  }
}
