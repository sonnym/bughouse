///////////////////////
// private variables //
///////////////////////
import board from "alekhine"

import crypto from "crypto"
const hash = d => crypto.createHash("sha1").update(d).digest("hex")
const clients = {}
let client_count = 0
const waiting = []

// linked list with lookup via hash key
const games = ((() => {
  let length = 0
  const nodes = {}
  let head = null
  let tail = null

  return {
    mk(w, b) {
      let gid = hash(w + b)
      let hash_l = 6

      // shorten gid
      while(nodes[gid.substring(0, hash_l)] > -1) hash_l++
      gid = gid.substring(0, hash_l)

      // create game object in two parts for closure
      nodes[gid] = { next: null
                   , prev: null
                   , gid
                   , state: { private: { white: w
                                       , black: b
                                       , board: new board()
                                       , watchers: []
                                       }
                            , public: null
                            }
                   }
      nodes[gid].state.public = { gid
                                , fen: nodes[gid].state.private.board.get_fen()
                                , b: clients[nodes[gid].state.private.black].name
                                , w: clients[nodes[gid].state.private.white].name
                                , s_w: ""
                                , s_b: ""
                                }

      // structural changes
      if (length == 0) {
        head = nodes[gid]
        tail = nodes[gid]
      } else {
        tail.next = nodes[gid]
        nodes[gid].prev = tail

        tail = nodes[gid]
      }
      length++

      return gid
    }
  , rm(gid) {
      const node = nodes[gid]

      if (node == null) return; // opponent already quit

      if (node.next == null) {
        tail = node.prev
      } else if (node.prev == null) {
        head = node.next
      } else {
        node.prev.next = node.next
        node.next.prev = node.prev
      }

      delete nodes[gid]
      length--
    }

  // etc
  , get_node(gid) {
      return nodes[gid]
    }
  , get_position(gid) {
      if (nodes[gid].prev) return this.get_position(nodes[gid].prev.gid) + 1
      else return 1
    }
  , get_next_or_head(gid) {
    return (nodes[gid].next) ? nodes[gid].next : head
  }
  , get_prev_or_tail(gid) {
    return (nodes[gid].prev) ? nodes[gid].prev : tai
  }

  , add_watcher(sid) {
      if (head) {
        head.state.private.watchers.push(sid)

        //log.debug("added watcher " + sid + "; game_id " + head.state.public.gid)

        return head.state.public.gid
      } else {
        //log.debug("added watcher " + sid + "; no games to watch")

        return null
      }
    }
  , mv_watcher(sid, from, to) {
    const node = games.get_node(from)
    const watchers = node.state.private.watchers
    const watcher_index = watchers.indexOf(sid)
    let new_gid = null

    if (watcher_index > -1) node.state.private.watchers = watchers.splice(watcher_index, 1)

    if (to == "h") {
      head.state.private.watchers.push(sid)
      new_gid = head.gid
    } else if (to == "l") {
      if (node.prev) {
        node.prev.state.private.watchers.push(sid)
        new_gid = node.prev.gid
      } else {
        tail.state.private.watchers.push(sid)
        new_gid = tail.gid
      }
    } else if (to == "r") {
      if (node.next) {
        node.next.state.private.watchers.push(sid)
        new_gid = node.next.gid
      } else {
        head.state.private.watchers.push(sid)
        new_gid = head.gid
      }
    } else if (to == "t") {
      tail.state.private.watchers.push(sid)
      new_gid = tail.gid
    }

    return new_gid
  }

  , set_board(gid, board) {
      nodes[gid].state.private.board = board
    }
  , carry_over(gid, piece) {
    const ascii = piece.charCodeAt(0)
    const node = nodes[gid]
    let to_gid

    if (node.next) {
      to_node = node.next
    } else if (head.gid != gid) {
      to_node = head
    } else {
      return; // there is only one game in progress, no carry over
    }

    if (ascii > 64 && ascii < 91) {
      to_node.state.public.s_w += piece
    } else if (ascii > 96 && ascii < 123) {
      to_node.state.public.s_b += piece
    }
  }
  , get_states(gid) {
    const node = nodes[gid]
    const states = {}

    if (!node) return

    states["c"] = node.state.public

    if (node.next) states["r"] = node.next.state.public
    else if (head && head.gid != node.gid && (node.prev && head.gid != node.prev.gid)) states["r"] = head.state.public
    else states["r"] = null

    if (node.prev) states["l"] = node.prev.state.public
    else if (tail && tail.gid != node.gid && (node.next && tail.gid != node.next.gid)) states["l"] = tail.state.public
    else states["l"] = null

    return states
  }
  , get_watchers(game) {
    const node = nodes[game]
    const watchers = []

    if (!node) return

    array_union(watchers, node.state.private.watchers)

    // TODO: add adjacent players

    if (node.next) array_union(watchers, node.next.state.private.watchers)
    else if (head) array_union(watchers, head.state.private.watchers)

    if (node.prev) array_union(watchers, node.prev.state.private.watchers)
    else if (tail) array_union(watchers, tail.state.private.watchers)

    return watchers
  }
  }
}))()

////////////////////
// public methods //

////////////////////
export function join(sid, name) {
  if (!clients[sid]) add_client(sid, name)

  if (waiting.length > 0) {
    const opp = waiting.pop()
    const color = (Math.floor(Math.random() * 2) == 0) ? "w" : "b"
    const ret = {}

    if (opp == sid) {
      waiting.push(sid); // get back in line
      return
    }

    const gid = (color == "w") ? games.mk(sid, opp) : games.mk(opp, sid)

    ret.gid = clients[sid].gid = clients[opp].gid = gid
    ret.states = games.get_states(gid)
    ret.opp = opp
    ret[sid] = color

    //log.info("game " + gid + " created for " + sid + " and " + opp)

    return ret
  } else {
    waiting.push(sid)

    return null
  }
}

export function update(sid, from, to, callback) {
  if (!clients[sid]) return; // client disconnected during an update

  const gid = clients[sid].gid
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
      games.get_node(gid).state.public.fen = board.get_fen()

      if (callback) callback({ gid, opp_id, watchers, state: games.get_node(gid).state.public })
    }
  })
}

export function kibitz(sid, name) {
  const gid = games.add_watcher(sid)

  add_client(sid, name, gid)

  return games.get_states(gid)
}

export function mv_watcher(sid, to) {
  if (!clients[sid]) return

  const client = clients[sid]
  const watch = clients[sid].watch
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

export function quit(sid) {
  const gid = clients[sid].gid
  const watch = clients[sid].gid
  let ret = null

  if (gid) {
    const opp_id = games.rm(gid)
    if (opp_id && clients[opp_id].gid) delete clients[opp_id].gid; // else opponent already quit

    // TODO: notify watchers

    ret = { game: gid, opp_id }
  } else if (watch) {
    const idx = games.get_node(watch).state.private.watchers.indexOf(sid)
    if (idx > -1) games.get_node(gid).state.private.watchers = games.get_node(gid).watchers.splice(idx, 1)
  }

  delete clients[sid]
  client_count--

  return ret
}

///////////////////////
// private functions //

///////////////////////
function add_client(sid, name, watch) {
  if (clients[sid]) return

  clients[sid] = { name }

  if (watch) clients[sid].watch = watch

  client_count++
}

function array_union(a1, a2) {
  for (let i = 0, l = a2.length; i < l; i++) a1.push(a2[i])
}
