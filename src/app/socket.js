import Client from "./models/client"

export default async (ws, req) => {
  await new Client(ws, req.user).connected()
}

export const __useDefault = true
