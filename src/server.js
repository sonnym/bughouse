import http from 'http'
import url from 'url'

import express from "express"
import ExpressWS from "express-ws"

import logger from "./server/logger"

const app = express()
const port = 3000

ExpressWS(app)

app.use(express.static("public"))

app.get("/", (req, res) => res.send(`
  <html>
    <head>
    </head>

    <script src="bundle.js">

    <body>
      <h1>...</h1>
    </body>
  </html>
`))

app.ws("/ws", (ws, req) => {
  console.log("socket connected")

  logger.info({
    message: "New websocket connection",
    websocket: ws,
    request: req
  })

  ws.send("Hello Client")

  ws.on("message", (message) => {
    console.log(`received ${message}`)

    ws.send(message)
  })
})

app.all("*", (...args) => logger("Invalid route", { args: args }))

app.listen(port, () => console.log(`Listening on port ${port}`))
