import { find, isNil, propEq } from "ramda"

import { BLACK } from "~/share/constants/chess"
import { PENDING } from "~/share/constants/results"
import { PLAY, START, MOVE, INVALID, RESULT } from "~/share/constants/actions"

import Revision from "./revision"

export default class Player {
  constructor(client) {
    this.user = client.user
    this.socket = client.socket
    this.universe = client.universe
    this.redisMediator = client.redisMediator

    this.gameUUID = null
    this.color = null
  }

  [PLAY]() {
    this.redisMediator.subscribeGameCreation()
    this.universe.play(this.user)
  }

  [START](serializedGame) {
    this.gameUUID = serializedGame.uuid
    this.color = find(
      propEq("uuid", this.user.get("uuid")),
      serializedGame.players
    ).color

    this.redisMediator.subscribeGame(this.gameUUID)
    this.socket.send({ action: START, game: serializedGame })
  }

  async [MOVE](spec) {
    if (isNil(this.gameUUID)) {
      return
    }

    const revision = await new Revision.move(this.gameUUID, this.color, spec)

    if (revision) {
      await revision.refresh({ withRelated: ["game", "position"] })

      this.processCapture(revision)
      this.processResult(revision)

      const position = revision.related("position")
      this.universe.publishPosition(this.gameUUID, position)

    } else {
      this.socket.send({ action: INVALID, spec })
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

  [RESULT](uuid) {
    if (this.gameUUID === uuid) {
      this.color = null
      this.gameUUID = null
    }
  }
}
