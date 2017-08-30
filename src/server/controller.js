import Model from "./model"
import getLogger from "./logger"

const logger = getLogger()
const model = new Model()

export default class {
  constructor(client) {
    this.client = client

    const states = model.kibitz(this)
    client.send({ action: "states", states })
  }

  join({name}) {
    const data = model.join(this.client, name)

    if (!data) {
      this.client.send({ action: "hold" })

    } else {
      const gid = data.gid
      const color = data[this.client.id]
      const opp_color = color == "w" ? "b" : "w"

      this.client.send({ action: "center", gid, color, states: data.states })
      data.opp.send({ action: "center", gid, color: opp_color, states: data.states })
    }
  }

  move({from, to}) {
    const self = this

    model.update(this.client.id, from, to, data => {
      if (!data) return; // client disconnected during an update

      const gid = data.gid
      const opp_id = data.opp_id
      const watchers = data.watchers

      self.clients[opp_id].send("state", data.state)

      for (let i = 0, l = watchers.length; i < l; i++) {
        const watcher = self.clients[watchers[i]]
        if (watcher) watcher.send("state", data.state)
      }

      logger.info(`recieved move from client with socket id: ${self.client.id}; from ${from} to ${to}; opp ${opp_id}`)
    })
  }

  rotate({to}) {
    const data = model.mvWatcher(this.client.id, to)
    this.client.send("rotate", Object.assigns(data, { to }))
  }

  disconnect({sessionId}) {
    model.quit(sessionId)
  }
}

export const __useDefault = true
