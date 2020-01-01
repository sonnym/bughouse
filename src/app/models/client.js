import { v4 } from "uuid"
import {
  forEach,
  forEachObjIndexed,
  isNil,
  map,
  reject,
  zipObj
} from "ramda"

import Redis from "./redis"

import Game from "./game"
import Revision from "./revision"

import { logger } from "~/app/index"

import { BEFORE, PRIMARY, AFTER } from "~/share/constants/role"
import { LEFT, RIGHT } from "~/share/constants/direction"
import { UNIVERSE_CHANNEL } from "./universe"

export default class Client {
  constructor(universe, user, socket) {
    this.universe = universe
    this.user = user
    this.socket = socket

    this.redis = new Redis()
    this.redis.on("message", this.messageHandler.bind(this))

    this.subscribeUniverse()

    this.uuid = v4()
    this.gameUUID = null
  }

  async startGame(serializedGame) {
    this.gameUUID = serializedGame.uuid

    this.subscribeGame(this.gameUUID)
    this.socket.send({ action: "start", game: serializedGame })
  }

  // senders

  sendUniverse(universe) {
    this.socket.send({ action: "universe", universe })
  }

  sendLogin() {
    if (isNil(this.user)) {
      return
    }

    this.socket.send({ action: "login", user: this.user.serialize() })
  }

  async sendGame(game, role) {
    if (isNil(game)) {
      return
    }

    await game.serializePrepare()

    this.socket.send({ action: "game", role, game: game.serialize() })
  }

  async sendPosition({ uuid, fen }) {
    this.socket.send({ action: "position", uuid, fen })
  }

  // subscribers

  subscribeUniverse() {
    this.redis.subscribe(UNIVERSE_CHANNEL)
  }

  subscribeGame(uuid) {
    this.redis.subscribe(uuid)
  }

  // actions

  async kibitz() {
    if (await this.universe.games.length() === 0) {
      return
    }

    const first = await this.universe.games.head()
    const second = await this.universe.games.next(first)
    const third = await this.universe.games.next(second)

    const uuids = [first, second, third]
    const notNilUUIDs = reject(isNil, uuids)

    const games = await Game.where("uuid", "in", notNilUUIDs).fetchAll()

    const orderedGames = map((uuid) => {
      return games.find((game) => { return game.get("uuid") === uuid })
    }, uuids)

    forEach(this.subscribeGame.bind(this), notNilUUIDs)

    forEachObjIndexed(
      this.sendGame.bind(this),
      zipObj([BEFORE, PRIMARY, AFTER], orderedGames)
    )
  }

  async rotate({ direction, of }) {
    let uuid, role

    switch (direction) {
      case LEFT:
        uuid = await this.universe.nextGame(of)
        role = AFTER
        break

      case RIGHT:
        uuid = await this.universe.prevGame(of)
        role = BEFORE
        break

      default:
        logger.debug(`[rotate] Encountere unexpected direction: ${direction}`)
        return
    }

    this.subscribeGame(uuid)
    this.sendGame(await Game.where({ uuid: uuid }).fetch(), role)
  }

  async play() {
    this.universe.registerClient(this)
  }

  async revision(data) {
    if (isNil(this.gameUUID)) {
      return
    }

    // TODO: authorize user
    const game = await new Game({ uuid: this.gameUUID }).fetch()
    const revision = await Revision.create(game, data)

    if (revision) {
      // TODO: if revision is a result, publish result, removing from state
      const position = await revision.position().fetch()
      this.universe.publishPosition(this.gameUUID, position)
    } else {
      this.socket.send({ action: "invalid", data })
    }
  }

  // handler

  messageHandler(channel, message) {
    switch (channel) {
      case UNIVERSE_CHANNEL:
        this.sendUniverse(JSON.parse(message))
        break

      default:
        this.sendPosition({ uuid: channel, fen: message })
    }
  }
}
