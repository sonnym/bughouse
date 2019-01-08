import ExpressWS from "express-ws"

export default async (app, SocketHandler) => {
  ExpressWS(app).getWss()
  app.ws("/ws", await SocketHandler)
}
