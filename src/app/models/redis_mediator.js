import { contains } from "ramda"

import Redis from "./redis"

import { UNIVERSE, REVISION } from "~/share/constants/actions"
import { UNIVERSE_CHANNEL, GAME_CREATION_CHANNEL } from "./universe"

import { RESIGN } from "~/share/constants/revision_types"

export default class RedisMediator {
  constructor(client) {
    this.client = client
    this.socket = client.socket

    this.redis = new Redis()
    this.redis.on("message", this.messageHandlerWrapper.bind(this))

    this.subscribeUniverse()
  }

  messageHandlerWrapper(channel, message) {
    process.nextTick(this.messageHandler.bind(this, channel, message))
  }

  async messageHandler(channel, message) {
    const parsedMessage = JSON.parse(message)

    switch (channel) {
      case UNIVERSE_CHANNEL:
        await this.handleUniverseMessage(parsedMessage)
        break

      case GAME_CREATION_CHANNEL:
        await this.handleGameCreationMessage(parsedMessage)
        break

      default:
        await this.handleRevisionCreationMessage(channel, parsedMessage)
    }
  }

  async handleUniverseMessage(serializedUniverse) {
    await this.socket.send({ action: UNIVERSE, universe: serializedUniverse })
  }

  async handleGameCreationMessage(serializedGame) {
    this.client.player.start(serializedGame)
    this.client.kibitzer.watch(serializedGame)
  }

  async handleRevisionCreationMessage(uuid, serializedRevision) {
    await this.socket.send({
      action: REVISION,
      uuid,
      revision: serializedRevision
    })

    if (contains(serializedRevision.type, [RESIGN])) {
      this.client.player.processResult(uuid)
    }
  }

  subscribeUniverse() {
    this.redis.subscribe(UNIVERSE_CHANNEL)
  }

  subscribeGameCreation() {
    this.redis.subscribe(GAME_CREATION_CHANNEL)
  }

  unSubscribeGameCreation() {
    this.redis.unsubscribe(GAME_CREATION_CHANNEL)
  }

  subscribeGame(uuid) {
    this.redis.subscribe(uuid)
  }

  unsubscribeGame(uuid) {
    this.redis.unsubscribe(uuid)
  }

  end() {
    this.redis.end(false)
  }
}
