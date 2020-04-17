import { forEach, forEachObjIndexed, isNil, map, reject, zipObj } from "ramda"

import { LEFT, RIGHT } from "~/share/constants/direction"
import { BEFORE, PRIMARY, AFTER } from "~/share/constants/role"
import { GAME } from "~/share/constants/actions"

import { logger } from "~/app/index"

import Game from "./game"

export default class Kibitzer {
  constructor(client) {
    this.socket = client.socket
    this.universe = client.universe
    this.redisMediator = client.redisMediator
  }

  async start() {
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
        logger.debug(`[rotate] Encountered unexpected direction: ${direction}`)
        return
    }

    this.redisMediator.subscribeGame(uuid)
    this.sendGame(await Game.where({ uuid: uuid }).fetch(), role)
  }

  // TODO: remove async/await
  async sendGame(game, role) {
    if (isNil(game)) {
      return
    }

    await game.serializePrepare()

    this.socket.send({ action: GAME, role, game: game.serialize() })
  }
}
