import { v4 } from "uuid"
import Board from "alekhine"

export default class GameList {
  constructor() {
    this.nodes = {}

    this.length = 0
    this.head = null
    this.tail = null
  }

  mk(white, black) {
    let gid = v4()

    // create game object in two parts for closure
    this.nodes[gid] = {
      next: null,
      prev: null,
      gid,
      state: {
        private: {
          white,
          black,
          board: new Board(),
          watchers: []
        }
      }
    }

    this.nodes[gid].state.public = {
      gid,
      fen: this.nodes[gid].state.private.board.getFen(),
      /*
      black: this.clients[black].name,
      white: this.clients[white].name,
      */
      stashWhite: "",
      stashBlack: ""
    }

    // structural changes
    if (this.length === 0) {
      this.head = this.nodes[gid]
      this.tail = this.nodes[gid]
    } else {
      this.tail.next = this.nodes[gid]
      this.nodes[gid].prev = this.tail

      this.tail = this.nodes[gid]
    }
    this.length++

    return gid
  }

  rm(gid) {
    const node = this.nodes[gid]

    if (node == null) return; // opponent already quit

    if (node.next == null) {
      tail = node.prev
    } else if (node.prev == null) {
      head = node.next
    } else {
      node.prev.next = node.next
      node.next.prev = node.prev
    }

    delete this.nodes[gid]
    this.length--
  }

  // etc
  getNode(gid) {
    return this.nodes[gid]
  }

  getPosition(gid) {
    if (this.nodes[gid].prev) return this.getPosition(this.nodes[gid].prev.gid) + 1
    else return 1
  }

  getNextOrHead(gid) {
    return (this.nodes[gid].next) ? this.nodes[gid].next : head
  }

  getPrevOrTail(gid) {
    return (this.nodes[gid].prev) ? this.nodes[gid].prev : tai
  }

  addWatcher(client) {
    if (head) {
      head.state.private.watchers(client)

      logger.info({ client }, `${client.id} began watching ${head.gid}`)

      return head.state.public.gid
    } else {
      //log.debug("added watcher " + sid + "; no games to watch")

      return null
    }
  }

  mvWatcher(sid, from, to) {
    const node = this.games.getNode(from)
    const watchers = node.state.private.watchers
    const watcher_index = watchers.indexOf(sid)

    let new_gid = null

    if (watcher_index > -1) node.state.private.watchers = watchers.splice(watcher_index, 1)

    if (to == "h") {
      head.state.private.watchers.push(sid)
      new_gid = head.gid
    } else if (to == "before") {
      if (node.prev) {
        node.prev.state.private.watchers.push(sid)
        new_gid = node.prev.gid
      } else {
        tail.state.private.watchers.push(sid)
        new_gid = tail.gid
      }
    } else if (to == "after") {
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

  setBoard(gid, board) {
    this.nodes[gid].state.private.board = board
  }

  carryOver(gid, piece) {
    const ascii = piece.charCodeAt(0)
    const node = this.nodes[gid]
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

  getStates(gid) {
    const node = this.nodes[gid]
    const states = {}

    if (!node) return

    states["center"] = node.state.public

    if (node.next) {
      states["after"] = node.next.state.public
    } else if (this.head && this.head.gid != node.gid && (node.prev && this.head.gid != node.prev.gid)) {
      states["after"] = this.head.state.public
    } else {
      states["after"] = null
    }

    if (node.prev) {
      states["before"] = node.prev.state.public
    } else if (this.tail && this.tail.gid != node.gid && (node.next && this.tail.gid != node.next.gid)) {
      states["before"] = this.tail.state.public
    } else {
      states["before"] = null
    }

    return states
  }

  getWatcherss(game) {
    const node = this.nodes[game]
    const watchers = []

    if (!node) return

    watchers.concat(node.state.private.watchers)

    // TODO: add adjacent players

    if (node.next) {
      watchers.concat(node.next.state.private.watchers)
    } else if (head) {
      watchers.concat(head.state.private.watchers)
    }

    if (node.prev) {
      watchers.concat(node.prev.state.private.watchers)
    } else if (tail) {
      watchers.concat(tail.state.private.watchers)
    }

    return watchers
  }
}
