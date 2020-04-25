import test from "ava"

import { mock, spy } from "sinon"

import { WHITE, BLACK } from "~/share/constants/chess"

import Player from "~/simul/player"

test("noop functions", t => {
  const player = new Player()

  t.is(typeof player.universe, "function")
})

test.skip("login: starts playing after receiving user information", t => {
  const sender = spy()
  const user = mock()

  const player = new Player(sender)

  player.login({ user })

  t.is(user, player.user)
  t.true(sender.called)
})

test("start: receives information about a game", t => {
  const user = { uuid: 0 }
  const game = {
    uuid: 0,
    players: [
      { color: WHITE, uuid: 0 },
      { color: BLACK, uuid: 1 }
    ]
  }

  const player = new Player(() => {})

  player.login({ user })
  player.start({ game })

  t.is(game, player.serializedGame)
})

test("position: receives information about positions", t => {
  const user = { uuid: 0 }
  const game = {
    uuid: 0,
    players: [
      { color: WHITE, uuid: 0 },
      { color: BLACK, uuid: 1 }
    ]
  }
  const position = { fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1" }

  const player = new Player(() => {})

  player.login({ user })
  player.start({ game })
  player.position({ game, position })

  t.pass()
})
