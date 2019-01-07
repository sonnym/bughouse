import ExpressWS from "express-ws"

export default function(app, SocketHandler) {
  ExpressWS(app).getWss()
  app.ws("/ws", SocketHandler)
}
