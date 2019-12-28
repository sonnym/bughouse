import test from "ava"

import { mock, spy } from "sinon"

import Player from "~/simul/player"

test("noop functions", t => {
  const player = new Player()

  t.is(typeof player.games, "function")
  t.is(typeof player.universe, "function")
})

test("starts playing after receiving user information", t => {
  const sender = spy()
  const user = mock()

  const player = new Player(sender)

  player.user({ user })

  t.is(user, player.user)
  t.true(sender.called)
})

test("receives information about a game", t => {
  const user = { uuid: 0 }
  const game = {
    uuid: 0,
    whiteUser: { uuid: 0 },
    blackUser: { uuid: 1 }
  }

  t.log("test")
  t.log(user)
  const player = new Player(() => {})

  player.user({ user })
  player.start({ game })

  t.is(game, player.game)
})

test("receives information about positions", t => {
  const user = { uuid: 0 }
  const game = {
    uuid: 0,
    whiteUser: { uuid: 0 },
    blackUser: { uuid: 1 }
  }
  const position = { fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1" }

  const player = new Player(() => {})

  player.user({ user })
  player.start({ game })
  player.position({ game, position })

  t.pass()
})
