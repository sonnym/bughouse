import { find, isNil, propEq } from "ramda"

import { PLAY, START, MOVE, DROP, INVALID, RESIGN } from "~/share/constants/actions"

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

  async start(serializedGame) {
    const player = find(
      propEq("uuid", this.user.get("uuid")),
      serializedGame.players
    )

    if (isNil(player)) {
      return
    }

    this.gameUUID = serializedGame.uuid
    this.color = player.color

    await this.redisMediator.unSubscribeGameCreation()
    await this.redisMediator.subscribeGame(this.gameUUID)

    await this.socket.send({ action: START, game: serializedGame })
  }

  processResult(uuid) {
    if (this.gameUUID === uuid) {
      this.color = null
      this.gameUUID = null
    }
  }

  async [PLAY]() {
    if (isNil(this.user)) {
      return
    }

    await this.redisMediator.subscribeGameCreation()
    await this.universe.play(this.user)
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

    return revision
  }

  async [DROP]({ piece, square } = { }) {
    if (isNil(this.gameUUID)) {
      return
    }

    const revision = await new Revision.drop(this.gameUUID, this.color, piece, square)

    if (revision === false) {
      this.socket.send({ action: INVALID, piece, square })

      return
    }

    return revision
  }

  async [RESIGN]() {
    await Revision.resign(this.gameUUID, this.color)
  }
}
