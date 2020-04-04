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

import { BLACK } from "~/share/constants/chess"
import { BEFORE, PRIMARY, AFTER } from "~/share/constants/role"
import { LEFT, RIGHT } from "~/share/constants/direction"
import { POSITION } from "~/share/constants/game_update_types"
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

  async sendPosition({ uuid, position }) {
    this.socket.send({ action: "position", uuid, position })
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

  async move(data) {
    if (isNil(this.gameUUID)) {
      return
    }

    // TODO: authorize user
    const { revision, moveResult } = await Revision.move({ uuid: this.gameUUID, ...data })

    if (revision) {
      if (moveResult && moveResult.captured) {
        // coerce into correct reserve
        if (moveResult.color === BLACK) {
          moveResult.captured = moveResult.piece.toUpperCase()
        }

        const game = await revision.game().fetch()
        this.universe.publishCapture(game, moveResult.captured)
      }

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
        this.sendGameUpdate(channel, message)
    }
  }

  sendGameUpdate(uuid, message) {
    const { type, payload } = JSON.parse(message)

    if (type === POSITION) {
      this.sendPosition({ uuid, position: payload })
    }
  }
}
