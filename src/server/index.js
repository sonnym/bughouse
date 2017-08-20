import http from 'http'
import url from 'url'

import express from "express"

import logger from "./logger"
import socketServer from './socket_server'

const app = express()
const port = 3000

socketServer(app)
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

app.listen(port, () => logger.info({
  label: `Listening on port ${port}`
}))

app.all("*", (...args) => logger.info({
  msg: "Invalid request",
  args: args
}))
