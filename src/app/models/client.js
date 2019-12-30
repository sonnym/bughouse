import { v4 } from "uuid"
import {
  forEach,
  forEachObjIndexed,
  filter,
  isNil,
  map,
  zipObj
} from "ramda"

import Redis from "./redis"

import Game from "./game"
import Revision from "./revision"

import { logger } from "~/app/index"
import { ROLES } from "~/share/constants"
import { UNIVERSE_CHANNEL } from "./universe"

export default class Client {
  constructor(universe, socket) {
    this.universe = universe
    this.socket = socket

    this.redis = new Redis()
    this.redis.on("message", this.messageHandler.bind(this))

    this.uuid = v4()
    this.gameUUID = null
  }

  async startGame(serializedGame) {
    this.gameUUID = serializedGame.uuid

    this.subscribeGame(this.gameUUID)
    this.socket.send({ action: "start", game: serializedGame })
  }

  // senders

  async sendUniverse() {
    this.socket.send({ action: "universe", ...await this.universe.serialize() })
  }

  async sendGame(game, role) {
    if (isNil(game)) {
      return
    }

    this.socket.send({
      action: "game",
      role,
      game: await game.serialize()
    })
  }

  async sendPosition({ uuid, fen }) {
    this.socket.send({ action: "position", uuid, fen })
  }

  // subscribers

  async subscribeUniverse() {
    await this.redis.subscribe(UNIVERSE_CHANNEL)
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

    const games = await Game.where("uuid", "in", uuids).fetchAll()
    const orderedGames = map((uuid) => {
      return games.find((game) => { return game.get("uuid") === uuid })
    }, uuids)

    forEach(this.subscribeGame.bind(this), filter(isNil, uuids))

    forEachObjIndexed(
      this.sendGame.bind(this),
      zipObj([ROLES.BEFORE, ROLES.PRIMARY, ROLES.AFTER], orderedGames)
    )
  }

  async play() {
    this.universe.registerClient(this)
  }

  async rotate({ direction, of }) {
    logger.debug(`rotating in ${direction} ${of}`)
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
    }
  }

  // handler

  messageHandler(channel, message) {
    switch (channel) {
      case UNIVERSE_CHANNEL:
        this.sendUniverse()
        break

      default:
        this.sendPosition({ uuid: channel, fen: message })
    }
  }
}
