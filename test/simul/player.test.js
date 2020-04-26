import test from "ava"

import { mock, stub, spy } from "sinon"

import { Chess } from "chess.js"

import { WHITE, BLACK, PAWN } from "~/share/constants/chess"

import Player from "~/simul/player"

test("noop functions", t => {
  const player = new Player()

  t.is(typeof player.game, "function")
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

test("move: always sends a move when reserve is empty", t => {
  const player = new Player()

  const sendMove = stub()
  player.sendMove = sendMove

  player.color = WHITE
  player.currentPosition = {
    reserves: { [WHITE]: { [PAWN]: 0 } }
  }

  player.move()

  t.true(sendMove.calledOnce)
})

test("move: either sends a move or a drop", t => {
  const player = new Player()

  const sendDrop = stub()
  player.sendDrop = sendDrop

  const sendMove = stub()
  player.sendMove = sendMove

  player.color = WHITE
  player.currentPosition = {
    reserves: { [WHITE]: { [PAWN]: 1 } }
  }

  player.move()

  const called = !!(
    (sendMove.calledOnce && !sendDrop.calledOnce) ^
    (sendDrop.calledOnce && !sendMove.calledOnce)
  )

  t.true(called)
})

test("sendDrop: selects a drop at random to send", t => {
  const send = stub()
  const player = new Player(send)

  player.color = WHITE
  player.chess = new Chess()
  player.currentPosition = {
    reserves: { [WHITE]: { [PAWN]: 1 } }
  }

  player.sendDrop()

  t.true(send.calledOnce)
})

test.todo("sendMove")
