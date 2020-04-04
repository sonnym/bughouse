import { v4 } from "uuid"
import {
  forEach,
  forEachObjIndexed,
  isNil,
  map,
  reject,
  zipObj
} from "ramda"

import RedisMediator from "./redis_mediator"

import Game from "./game"
import Revision from "./revision"

import { logger } from "~/app/index"

import { BLACK } from "~/share/constants/chess"
import { PENDING } from "~/share/constants/results"
import { BEFORE, PRIMARY, AFTER } from "~/share/constants/role"
import { LEFT, RIGHT } from "~/share/constants/direction"

export default class Client {
  constructor(universe, user, socket) {
    this.universe = universe
    this.user = user
    this.socket = socket

    this.redisMediator = new RedisMediator(this.socket)

    this.uuid = v4()
    this.gameUUID = null
  }

  async startGame(serializedGame) {
    this.gameUUID = serializedGame.uuid

    this.redisMediator.subscribeGame(this.gameUUID)
    this.socket.send({ action: "start", game: serializedGame })
  }

  // senders

  sendLogin() {
    if (isNil(this.user)) {
      return
    }

    this.socket.send({ action: "login", user: this.user.serialize() })
  }

  // TODO: remove async/await
  async sendGame(game, role) {
    if (isNil(game)) {
      return
    }

    await game.serializePrepare()

    this.socket.send({ action: "game", role, game: game.serialize() })
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

    forEach(uuid => {
      this.redisMediator.subscribeGame(uuid)
    }, notNilUUIDs)

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

    this.redisMediator.subscribeGame(uuid)
    this.sendGame(await Game.where({ uuid: uuid }).fetch(), role)
  }

  async play() {
    this.universe.registerClient(this)
  }

  async move(move) {
    if (isNil(this.gameUUID)) {
      return
    }

    // TODO: authorize user
    const { revision, moveResult } = await Revision.move(this.gameUUID, move)

    if (revision) {
      await revision.refresh({ withRelated: ["game", "position"] })

      this.processCapture(revision, moveResult)
      this.processResult(revision)

      const position = revision.related("position")
      this.universe.publishPosition(this.gameUUID, position)

    } else {
      this.socket.send({ action: "invalid", move })
    }
  }

  async processCapture(revision, moveResult) {
    if (moveResult && moveResult.captured) {
      // coerce into correct reserve
      if (moveResult.color === BLACK) {
        moveResult.captured = moveResult.piece.toUpperCase()
      }

      const game = await revision.related("game")
      this.universe.publishCapture(game, moveResult.captured)
    }
  }

  async processResult(revision) {
    const game = await revision.related("game")

    if (game.get("result") === PENDING) {
      return
    }

    this.universe.publishResult(game.get("uuid"), game.get("result"))
  }

  end() {
    this.redisMediator.end()
  }
}
