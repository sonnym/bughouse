import Redis from "./redis"

import { UNIVERSE } from "~/share/constants/actions"
import { POSITION, RESULT } from "~/share/constants/game_update_types"
import { UNIVERSE_CHANNEL, GAME_CREATION_CHANNEL } from "./universe"

export default class RedisMediator {
  constructor(client) {
    this.client = client
    this.socket = client.socket

    this.redis = new Redis()
    this.redis.on("message", this.messageHandler.bind(this))

    this.subscribeUniverse()
  }

  messageHandler(channel, message) {
    switch (channel) {
      case UNIVERSE_CHANNEL:
        this.sendUniverse(JSON.parse(message))
        break

      case GAME_CREATION_CHANNEL:
        this.handleGameCreation(JSON.parse(message))
        break

      default:
        this.sendGameUpdate(channel, message)
    }
  }

  subscribeUniverse() {
    this.redis.subscribe(UNIVERSE_CHANNEL)
  }

  subscribeGameCreation() {
    this.redis.subscribe(GAME_CREATION_CHANNEL)
  }

  subscribeGame(uuid) {
    this.redis.subscribe(uuid)
  }

  sendUniverse(universe) {
    this.socket.send({ action: UNIVERSE, universe })
  }

  handleGameCreation(serializedGame) {
    this.client.start(serializedGame)
  }

  sendGameUpdate(uuid, message) {
    const { type, payload } = JSON.parse(message)

    if (type === POSITION) {
      this.sendPosition({ uuid, position: payload })

    } else if (type === RESULT) {
      this.sendResult({ uuid, result: payload })

      this.client.result(uuid)
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
