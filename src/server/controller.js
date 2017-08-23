import _ from "underscore"

import Model from "./model"
import getLogger from "./logger"

const logger = getLogger()
const model = new Model()

export default class {
  constructor(ws) {
    this._socket = ws
  }

  join() {
    const name = this._message.name
    const data = model.join(this._socket.id, name)

    if (!data) {
      logger.info(`user with name ${name} joined; held`)
      this._socket.emit("hold")

    } else {
      const gid = data.gid
      const color = data[this._socket.id]
      const opp_id = data.opp
      const opp_color = color == "w" ? "b" : "w"

      logger.info(`user with name ${name}, this._socket_id ${this._socket.id} joined; assigned: ${color}; opponent: ${opp_id} ${opp_color}`)

      this._socket.emit("game", {gid, color, states: data.states})
      this._sockets[opp_id].emit("game", {gid, color: opp_color, states: data.states})
    }
  }

  move() {
    const from = this._message.f
    const to = this._message.t
    const self = this

    model.update(this._socket.id, from, to, data => {
      if (!data) return; // client disconnected during an update

      const gid = data.gid
      const opp_id = data.opp_id
      const watchers = data.watchers

      self._sockets[opp_id].emit("state", data.state)

      for (let i = 0, l = watchers.length; i < l; i++) {
        const watcher = self._sockets[watchers[i]]
        if (watcher) watcher.emit("state", data.state)
      }

      logger.info(`recieved move from client with socket id: ${self._socket.id}; from ${from} to ${to}; opp ${opp_id}`)
    })
  }

  kibitz() {
    const states = model.kibitz(this._socket.id, this._message.name)
    this._socket.emit("kibitz", { states })
  }

  rotate() {
    const data = model.mv_watcher(this._socket.id, this._message.t)
    this._socket.emit("rotate", _.extend(data, { to: this._message.t }))
  }

  disconnect({sessionId}) {
    model.quit(sessionId)
  }
}

export const __useDefault = true
