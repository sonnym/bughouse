import _ from "underscore"

import Model from "./model"
import getLogger from "./logger"

const logger = getLogger()
const model = new Model()

export default class {
  constructor(ws) {
    this._socket = ws
  }

  join({name}) {
    const data = model.join(this._socket.id, name)

    if (!data) {
      logger.info(`user with name ${name} joined; held`)
      this._socket.send("hold")

    } else {
      const gid = data.gid
      const color = data[this._socket.id]
      const opp_id = data.opp
      const opp_color = color == "w" ? "b" : "w"

      logger.info(`user with name ${name}, this._socket_id ${this._socket.id} joined; assigned: ${color}; opponent: ${opp_id} ${opp_color}`)

      this._socket.send("game", {gid, color, states: data.states})
      this._sockets[opp_id].send("game", {gid, color: opp_color, states: data.states})
    }
  }

  move({from, to}) {
    const self = this

    model.update(this._socket.id, from, to, data => {
      if (!data) return; // client disconnected during an update

      const gid = data.gid
      const opp_id = data.opp_id
      const watchers = data.watchers

      self._sockets[opp_id].send("state", data.state)

      for (let i = 0, l = watchers.length; i < l; i++) {
        const watcher = self._sockets[watchers[i]]
        if (watcher) watcher.send("state", data.state)
      }

      logger.info(`recieved move from client with socket id: ${self._socket.id}; from ${from} to ${to}; opp ${opp_id}`)
    })
  }

  kibitz({name}) {
    const states = model.kibitz(this._socket.id, name)
    this._socket.send("kibitz", { states })
  }

  rotate({to}) {
    const data = model.mv_watcher(this._socket.id, to)
    this._socket.send("rotate", _.extend(data, { to }))
  }

  disconnect({sessionId}) {
    model.quit(sessionId)
  }
}

export const __useDefault = true
