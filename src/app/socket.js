import Client from "./models/client"

export default (ws, req) => {
  new Client(ws, req.user).connected()
}
