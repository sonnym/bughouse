import Redis from "./redis"

import { UNIVERSE } from "~/share/constants/actions"
import { POSITION, RESULT } from "~/share/constants/game_update_types"
import { UNIVERSE_CHANNEL } from "./universe"

export default class RedisMessageHander {
  constructor(socket) {
    this.socket = socket

    this.redis = new Redis()
    this.redis.on("message", this.messageHandler.bind(this))

    this.subscribeUniverse()
  }

  messageHandler(channel, message) {
    switch (channel) {
      case UNIVERSE_CHANNEL:
        this.sendUniverse(JSON.parse(message))
        break

      default:
        this.sendGameUpdate(channel, message)
    }
  }

  subscribeUniverse() {
    this.redis.subscribe(UNIVERSE_CHANNEL)
  }

  subscribeGame(uuid) {
    this.redis.subscribe(uuid)
  }

  sendUniverse(universe) {
    this.socket.send({ action: UNIVERSE, universe })
  }

  sendGameUpdate(uuid, message) {
    const { type, payload } = JSON.parse(message)

    if (type === POSITION) {
      this.sendPosition({ uuid, position: payload })

    } else if (type === RESULT) {
      this.sendResult({ uuid, result: payload })
    }
  }

  sendPosition({ uuid, position }) {
    this.socket.send({ action: POSITION, uuid, position })
  }

  sendResult({ uuid, result }) {
    this.socket.send({ action: RESULT, uuid, result })
  }

  end() {
    this.redis.end(false)
  }
}
