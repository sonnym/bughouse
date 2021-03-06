import {
  append,
  drop,
  dropLast,
  forEach,
  forEachObjIndexed,
  isNil,
  last,
  map,
  prepend,
  reject,
  zipObj
} from "ramda"

import { LEFT, RIGHT } from "~/share/constants/direction"
import { BEFORE, PRIMARY, AFTER } from "~/share/constants/role"
import { GAME } from "~/share/constants/actions"

import Game from "./game"

export default class Kibitzer {
  constructor({ socket, games, redisMediator }) {
    this.socket = socket
    this.games = games
    this.redisMediator = redisMediator

    this.watching = []
  }

  async start() {
    if (await this.games.length() === 0) {
      return
    }

    const first = await this.games.head()
    const second = await this.games.next(first)
    const third = await this.games.next(second)

    const uuids = [first, second, third]
    const notNilUUIDs = reject(isNil, uuids)

    const games = await Game.where("uuid", "in", notNilUUIDs).fetchAll({
      withRelated: Game.serializeRelated
    })

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

    this.watching = notNilUUIDs

    if (this.watching.length < 3) {
      this.redisMediator.subscribeGameCreation()
    }
  }

  async watch(serializedGame) {
    if (this.watching.length === 3) {
      await this.redisMediator.unSubscribeGameCreation()
    }

    if (this.watching.length === 0) {
      await this.sendSerializedGame(serializedGame, PRIMARY)
    } else {
      await this.rotate({ direction: LEFT, of: last(this.watching) })
    }
  }

  async rotate({ direction, of }) {
    let uuid, role

    switch (direction) {
      case LEFT:
        uuid = await this.games.before(of)
        role = AFTER
        this.appendToWatching(uuid)
        break

      case RIGHT:
        uuid = await this.games.after(of)
        role = BEFORE
        this.prependToWatching(uuid)
        break

      default:
        return
    }

    const game = await Game.where({ uuid: uuid }).fetch({
      withRelated: Game.serializeRelated
    })

    this.redisMediator.subscribeGame(uuid)
    this.sendGame(game, role)
  }

  async stop() {
    forEach(async function(uuid) {
      await this.redisMediator.unsubscribeGame(uuid)
    }, this.watching)

    this.watching = []
  }

  async sendGame(game, role) {
    if (isNil(game)) {
      return
    }

    await this.socket.send({ action: GAME, role, game: game.serialize() })
  }

  async sendSerializedGame(serializedGame, role) {
    await this.socket.send({ action: GAME, role, game: serializedGame })
  }

  appendToWatching(uuid) {
    const watching = append(uuid, this.watching)

    if (this.watching.length > 3) {
      this.watching = drop(1, watching)
    } else {
      this.watching = watching
    }
  }

  prependToWatching(uuid) {
    const watching = prepend(uuid, this.watching)

    if (this.watching.length > 3) {
      this.watching = dropLast(1, watching)
    } else {
      this.watching = watching
    }
  }
}
