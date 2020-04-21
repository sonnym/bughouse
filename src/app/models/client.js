import { isNil, } from "ramda"

import RedisMediator from "./redis_mediator"

import Kibitzer from "./kibitzer"
import Player from "./player"

import {
  KIBITZ,
  ROTATE,
  LOGIN,
  PLAY,
  MOVE,
  RESULT
} from "~/share/constants/actions"

export default class Client {
  constructor(universe, user, socket) {
    this.universe = universe
    this.user = user
    this.socket = socket

    this.redisMediator = new RedisMediator(this)

    this.player = new Player(this)
    this.kibitzer = new Kibitzer(this)
  }

  sendLogin() {
    if (isNil(this.user)) {
      return
    }

    this.socket.send({ action: LOGIN, user: this.user.serialize() })
  }

  get gameUUID() {
    return this.player.gameUUID
  }

  [KIBITZ]() {
    this.kibitzer.start()
  }

  [ROTATE](spec) {
    this.kibitzer.rotate(spec)
  }

  [PLAY]() {
    this.player.play()
  }

  [MOVE](spec) {
    this.player.move(spec)
  }

  [RESULT](uuid) {
    this.player.result(uuid)
  }

  end() {
    this.redisMediator.end()
  }
}
