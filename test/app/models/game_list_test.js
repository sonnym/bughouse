import test from "ava"
import GameList from "./../../../src/app/models/game_list"

test.beforeEach(t => {
  t.context = new GameList()
})

test("properties after instantiation", t => {
  t.is(t.context.length, 0)
  t.is(t.context.head, null)
  t.is(t.context.tail, null)
})

test("creating a new game", t => {
  const gid = t.context.mk("foo", "bar")

  t.not(gid.length, 0)

  t.is(t.context.length, 1)
  t.not(t.context.head, null)
  t.not(t.context.tail, null)
})

test("removing a game", t => {
  const gid = t.context.mk("foo", "bar")

  t.context.rm(gid)
  t.is(t.context.length, 0)
})

test("getStates", t => {
  const gid = t.context.mk("foo", "bar")

  t.not(t.context.getStates(gid), null)
})
