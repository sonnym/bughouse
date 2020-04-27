import { find, isNil, propEq } from "ramda"

import { PENDING } from "~/share/constants/results"
import { PLAY, START, MOVE, DROP, INVALID, RESIGN, RESULT } from "~/share/constants/actions"

import Revision from "./revision"

export default class Player {
  constructor({ user, socket, universe, redisMediator } = { }) {
    this.user = user
    this.socket = socket
    this.universe = universe
    this.redisMediator = redisMediator

    this.gameUUID = null
    this.color = null
  }

  [PLAY]() {
    this.redisMediator.subscribeGameCreation()
    this.universe.play(this.user)
  }

  [START](serializedGame) {
    const player = find(
      propEq("uuid", this.user.get("uuid")),
      serializedGame.players
    )

    if (isNil(player)) {
      return
    }

    this.gameUUID = serializedGame.uuid
    this.color = player.color

    this.redisMediator.unSubscribeGameCreation()
    this.redisMediator.subscribeGame(this.gameUUID)

    this.socket.send({ action: START, game: serializedGame })
  }

  async [MOVE](spec) {
    if (isNil(this.gameUUID)) {
      return
    }

    const revision = await new Revision.move(this.gameUUID, this.color, spec)

    if (revision === false) {
      this.socket.send({ action: INVALID, spec })

      return
    }

    await revision.refresh({ withRelated: ["game", "position"] })

    this.processCapture(revision)
    this.processResult(revision)

    this.universe.publishPosition(this.gameUUID, revision.related("position"))
  }

  async [DROP]({ piece, square } = { }) {
    if (isNil(this.gameUUID)) {
      return false
    }

    const revision = await new Revision.drop(this.gameUUID, this.color, piece, square)

    if (revision === false) {
      this.socket.send({ action: INVALID, piece, square })

      return
    }

    this.processResult(revision)

    this.universe.publishPosition(this.gameUUID, revision.related("position"))
  }

  [RESIGN]() {
    const revision = Revision.resign(this.gameUUID, this.color)

    this.processResult(revision)
  }

  async processCapture(revision) {
    const move = revision.get("move")

    if (move && move.captured) {
      const game = await revision.related("game")

      this.universe.publishCapture(game, move.color, move.captured)
    }
  }

  async processResult(revision) {
    const game = await revision.related("game")

    if (game.get("result") === PENDING) {
      return
    }

    this.universe.publishResult(game.get("uuid"), game.get("result"))
  }

  [RESULT](uuid) {
    if (this.gameUUID === uuid) {
      this.color = null
      this.gameUUID = null
    }
  }
}
