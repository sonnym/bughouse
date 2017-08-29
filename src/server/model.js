import crypto from "crypto"

import GameList from "./game_list"

const games = new GameList()

export default class Model {
  constructor() {
    this.clients = []
    this.waiting = []
  }

  join(client, name) {
    if (this.clients.indexOf(client) === -1) {
      this.clients.push(client)
    }

    client.name = name

    if (this.waiting.length > 0) {
      const opp = this.waiting.pop()
      const color = (Math.floor(Math.random() * 2) == 0) ? "w" : "b"
      const ret = {}

      if (opp === client) {
        this.waiting.push(client); // get back in line
        return
      }

      const gid = (color == "w") ? games.mk(client, opp) : games.mk(opp, client)

      ret.gid = gid
      ret.states = games.get_states(gid)
      ret.opp = opp
      ret[client.id] = color

      //log.info("game " + gid + " created for " + sid + " and " + opp)

      return ret
    } else {
      this.waiting.push(client)

      return null
    }
  }

   update(sid, from, to, callback) {
    if (!this.clients[sid]) return; // client disconnected during an update

    const gid = this.clients[sid].gid
    const node = games.get_node(gid)
    const board = node.state.private.board

    board.move(from, to, (message, captured) => {
      // TODO: promotions

      if (message == "invalid") {
        //log.info("client " + sid + " performed an invalid move; from: " + from + "; to: " + to + "; fen: " + board.get_fen())
        // TODO: handle invalid moves?
      } else if (message == "complete") {
        const w = node.state.private.white
        const b = node.state.private.black
        const opp_id = (sid == w) ? b : w
        const watchers = games.get_watchers(gid)

        if (captured) {
          games.carry_over(gid, captured)
        }

        games.set_board(gid, board)
        games.get_node(gid).state.public.fen = board.getFen()

        if (callback) callback({ gid, opp_id, watchers, state: games.get_node(gid).state.public })
      }
    })
  }

  kibitz(client) {
    const gid = games.addWatcher(clioent)

    this.clients.push(client)

    return games.getStates(client)
  }

  mv_watcher(sid, to) {
    if (!this.clients[sid]) return

    const client = this.clients[sid]
    const watch = this.clients[sid].watch
    const new_gid = games.mv_watcher(sid, watch, to)

    client.watch = new_gid

    if (to === "h" || to === "t") {
      return { states: games.get_states(new_gid) }
    } else {
      if (to === "l") {
        var state = games.get_next_or_head(new_gid).state.public
      } else if (to === "r") {
        var state = games.get_prev_or_tail(new_gid).state.public
      }

      return { state }
    }
  }

  quit(sid) {
    const gid = this.clients[sid].gid
    const watch = this.clients[sid].gid
    let ret = null

    if (gid) {
      const opp_id = games.rm(gid)
      if (opp_id && this.clients[opp_id].gid) delete this.clients[opp_id].gid; // else opponent already quit

      // TODO: notify watchers

      ret = { game: gid, opp_id }
    } else if (watch) {
      const idx = games.get_node(watch).state.private.watchers.indexOf(sid)
      if (idx > -1) games.get_node(gid).state.private.watchers = games.get_node(gid).watchers.splice(idx, 1)
    }

    delete this.clients[sid]
    this.clientCount--

    return ret
  }
}
