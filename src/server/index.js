import http from 'http'
import url from 'url'
import { inspect } from "util"

import express from "express"

import { environment } from "./environment"

import getLogger from "./logger"
import socketServer from './socket_server'

const logger = getLogger()

const app = express()
const port = 3000

socketServer(app)
app.use(express.static("public"), (req, res) => {
  logger.info({ req, res }, "Served static file")
})

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

app.all("*", (req, res) => logger.info({ req, res }, "Invalid request"))

app.listen(port, () => logger.info(`Listening on port ${port}`))
