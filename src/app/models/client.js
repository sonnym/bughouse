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
import {
  KIBITZ,
  ROTATE,
  LOGIN,
  GAME,
  PLAY,
  START,
  MOVE,
  INVALID
} from "~/share/constants/actions"

export default class Client {
  constructor(universe, user, socket) {
    this.universe = universe
    this.user = user
    this.socket = socket

    this.redisMediator = new RedisMediator(this.socket)

    this.uuid = v4()

    this.gameUUID = null
    this.color = null
  }

  startGame(serializedGame, color) {
    this.gameUUID = serializedGame.uuid
    this.color = color

    this.redisMediator.subscribeGame(this.gameUUID)
    this.socket.send({ action: START, game: serializedGame })
  }

  // senders

  sendLogin() {
    if (isNil(this.user)) {
      return
    }

    this.socket.send({ action: LOGIN, user: this.user.serialize() })
  }

  // TODO: remove async/await
  async sendGame(game, role) {
    if (isNil(game)) {
      return
    }

    await game.serializePrepare()

    this.socket.send({ action: GAME, role, game: game.serialize() })
  }

  // actions

  async [KIBITZ]() {
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

  async [ROTATE]({ direction, of }) {
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

  async [PLAY]() {
    this.universe.registerClient(this)
  }

  async [MOVE](move) {
    if (isNil(this.gameUUID)) {
      return
    }

    const revision = await Revision.move(this.gameUUID, this.color, move)

    if (revision) {
      await revision.refresh({ withRelated: ["game", "position"] })

      this.processCapture(revision)
      this.processResult(revision)

      const position = revision.related("position")
      this.universe.publishPosition(this.gameUUID, position)

    } else {
      this.socket.send({ action: INVALID, move })
    }
  }

  async processCapture(revision) {
    const move = revision.get("move")

    if (move && move.captured) {
      // coerce into correct reserve
      if (move.color === BLACK) {
        move.captured = move.piece.toUpperCase()
      }

      const game = await revision.related("game")

      this.universe.publishCapture(game, move.captured)
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
