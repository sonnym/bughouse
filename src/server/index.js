import http from 'http'
import url from 'url'

import express from "express"
import ExpressWS from "express-ws"

import logger from "./logger"

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
  logger.debug({
    label: "Websocket connection established",
    websocket: ws
  })

  ws.on("message", (message) => {
    logger.debug({
      label: "Websocket message received",
      contents: message,
      websocket: ws
    })

    ws.send(message)
  })
})

app.all("*", (...args) => logger.debug({
  label: "Invalid request",
  args: args
}))

app.listen(port, () => logger.info({
  label: `Listening on port ${port}`
}))
