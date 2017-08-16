import http from 'http'
import url from 'url'

import express from "express"
import WebSocket from 'ws'

const app = express()
const port = 3000

const server = http.createServer(app)
const wss = new WebSocket.Server({ server })

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

app.listen(port, () => console.log(`Listening on port ${port}`))

wss.on("connection", (ws, req) => {
  const location = url.parse(req, url, true)

  ws.on("message", (message) => { console.log(`received ${message}`) })

  ws.send(message)
})
