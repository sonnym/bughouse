import { isNil, } from "ramda"

import RedisMediator from "./redis_mediator"

import Kibitzer from "./kibitzer"
import Player from "./player"

import {
  KIBITZ,
  ROTATE,
  LOGIN,
  LEAVE,
  PLAY,
  MOVE,
  DROP,
  RESIGN
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

    this.socket.send({ action: LOGIN, ...this.user.serialize() })
  }

  get games() {
    return this.universe && this.universe.games
  }

  get gameUUID() {
    return this.player.gameUUID
  }

  async [KIBITZ]() {
    await this.kibitzer.start()
  }

  async [ROTATE](spec) {
    await this.kibitzer.rotate(spec)
  }

  async [LEAVE]() {
    await this.kibitzer.stop()
  }

  async [PLAY]() {
    await this.player.play()
  }

  async [MOVE](spec) {
    await this.player.move(spec)
  }

  async [DROP](spec) {
    await this.player.drop(spec)
  }

  async [RESIGN]() {
    await this.player.resign()
  }

  end() {
    this.redisMediator.end()
  }
}
