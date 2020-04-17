import { v4 } from "uuid"

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
} from "~/share/constants/actions"

export default class Client {
  constructor(universe, user, socket) {
    this.universe = universe
    this.user = user
    this.socket = socket

    this.uuid = v4()

    this.redisMediator = new RedisMediator(this.socket)

    this.player = new Player(this)
    this.kibitzer = new Kibitzer(this)
  }

  sendLogin() {
    if (isNil(this.user)) {
      return
    }

    this.socket.send({ action: LOGIN, user: this.user.serialize() })
  }

  startGame(serializedGame, color) {
    this.player.startGame(serializedGame, color)
  }

  [KIBITZ]() {
    this.kibitzer.start()
  }

  [ROTATE](spec) {
    this.kibitzer.rotate(spec)
  }

  [PLAY]() {
    this.player.start()
  }

  [MOVE](spec) {
    this.player.move(spec)
  }

  end() {
    this.redisMediator.end()
  }
}
