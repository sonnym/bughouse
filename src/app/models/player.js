import Game from "./game"
import Revision from "./revision"

import { forEachObjIndexed, isNil, map, zipObj } from "ramda"

import { logger } from "~/app/index"
import { ROLES } from "~/share/constants"

export default class Player {
  constructor(universe, socket) {
    this.universe = universe
    this.socket = socket

    this.socket.redis.on("universe", this.sendUniverse.bind(this))
    this.socket.redis.on("position", this.sendPosition.bind(this))

    this.serializedGame = null
  }

  async sendUniverse() {
    this.socket.send({ action: "universe", ...await this.universe.serialize() })
  }

  sendPosition({ uuid, fen }) {
    this.socket.send({ action: "position", game: uuid, position: fen })
  }

  play() {
    this.universe.play(this)
  }

  async startGame(serializedGame) {
    this.serializedGame = serializedGame

    await this.socket.redis.subscribeAsync(serializedGame.uuid)

    this.socket.send({ action: "start", game: serializedGame })
  }

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
      this.subscribeGame.bind(this),
      zipObj([ROLES.BEFORE, ROLES.PRIMARY, ROLES.AFTER], orderedGames)
    )
  }

  async subscribeGame(game, role) {
    if (isNil(game)) {
      return
    }

    this.socket.redis.subscribeAsync(game.get("uuid"))
    this.socket.send({ action: "game", ...(game.serialize) })
  }

  async subscribe({ direction, of }) {
    logger.debug(`rotating in ${direction} ${of}`)
  }

  async revision(data) {
    const game = await Game.where({ uuid: this.serializedGame.uuid }).fetch()

    if (await Revision.create(game, data)) {
      Game.emit("revision", game)
    }
  }
}
