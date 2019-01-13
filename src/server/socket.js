import ExpressWS from "express-ws"

export default (app, SocketHandler) => {
  ExpressWS(app).getWss()
  app.ws("/ws", SocketHandler)
}
