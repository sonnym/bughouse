import { v4 } from "uuid"
import { forEachObjIndexed, isNil, map, zipObj } from "ramda"

import Redis from "./redis"

import { UNIVERSE_CHANNEL } from "./universe"

import Game from "./game"
import Revision from "./revision"

import { logger } from "~/app/index"
import { ROLES } from "~/share/constants"

export default class Client {
  constructor(universe, socket) {
    this.universe = universe
    this.socket = socket

    this.redis = new Redis()

    this.uuid = v4()
    this.game = null
  }

  // senders

  async sendUniverse() {
    this.socket.send({ action: "universe", ...await this.universe.serialize() })
  }

  async sendGame(game, role) {
    if (isNil(game)) {
      return
    }

    this.subscribeGame(game)
    this.socket.send({ action: "game", role, game: await game.serialize() })
  }

  async sendPosition({ uuid, fen }) {
    this.socket.send({ action: "position", game: uuid, position: fen })
  }

  // subscribers

  async subscribeUniverse() {
    await this.redis.subscribeAsync(UNIVERSE_CHANNEL)
  }

  subscribeGame(game) {
    this.redis.subscribe(game.get("uuid"))
  }

  // actions

  async subscribeGames() {
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

    forEachObjIndexed(
      this.sendGame.bind(this),
      zipObj([ROLES.BEFORE, ROLES.PRIMARY, ROLES.AFTER], orderedGames)
    )
  }

  async play() {
    this.universe.registerClient(this)
  }

  async startGame(game) {
    this.game = game

    const serializedGame = await this.game.serialize()

    this.subscribeGame(game)
    this.socket.send({ action: "start", game: serializedGame })
  }

  async subscribe({ direction, of }) {
    logger.debug(`rotating in ${direction} ${of}`)
  }

  async revision(data) {
    const result = await Revision.create(this.game, data) // TODO: more useful return value

    if (result) {
      this.universe.publishPosition(this.game)
    }
  }

  // handler

  handleMessage(channel, message) {
    switch (channel) {
      case UNIVERSE_CHANNEL:
        this.sendUniverse()
        break

      default:
        this.sendPosition({ uuid: channel, fen: message })
    }
  }
}
