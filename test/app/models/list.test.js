import test from "ava"

import { v4 } from "uuid"

import List from "~/app/models/list"

test("instantiation", async t => {
  const prefix = v4()
  const list = new List(prefix)

  t.is(0, await list.length())
  t.is(null, await list.head())
  t.is(null, await list.tail())
})

test("push reserved word", async t => {
  const prefix = v4()
  const list = new List(prefix, t)

  t.false(await list.push("length"))
})

test("push initial item", async t => {
  const prefix = v4()
  const list = new List(prefix, t)

  const item = v4()
  await list.push(item)

  t.is(1, await list.length())
  t.is(item, await list.head())
  t.is(item, await list.tail())
})

test("push second item", async t => {
  const prefix = v4()
  const list = new List(prefix, t)

  const [first, second] = [v4(), v4()]
  await list.push(first)
  await list.push(second)

  t.is(2, await list.length())
  t.is(first, await list.head())
  t.is(second, await list.tail())
})

test("remove reserved word", async t => {
  const prefix = v4()
  const list = new List(prefix, t)

  t.false(await list.remove("length"))
})

test("remove only item", async t => {
  const prefix = v4()
  const list = new List(prefix, t)

  const item = v4()

  await list.push(item)
  await list.remove(item)

  t.is(0, await list.length())
  t.is(null, await list.head())
  t.is(null, await list.tail())
})

test("remove head", async t => {
  const prefix = v4()
  const list = new List(prefix, t)

  const [first, second] = [v4(), v4()]
  await list.push(first)
  await list.push(second)

  await list.remove(first)

  t.is(1, await list.length())
  t.is(second, await list.head())
  t.is(second, await list.tail())
})

test("remove tail", async t => {
  const prefix = v4()
  const list = new List(prefix, t)

  const [first, second] = [v4(), v4()]
  await list.push(first)
  await list.push(second)

  await list.remove(second)

  t.is(1, await list.length())
  t.is(first, await list.head())
  t.is(first, await list.tail())
})

test("remove middle item", async t => {
  const prefix = v4()
  const list = new List(prefix, t)

  const [first, second, third] = [v4(), v4(), v4()]
  await list.push(first)
  await list.push(second)
  await list.push(third)

  await list.remove(second)

  t.is(2, await list.length())
  t.is(first, await list.head())
  t.is(third, await list.tail())
})

test("prev", async t => {
  const prefix = v4()
  const list = new List(prefix, t)

  const [first, second] = [v4(), v4()]
  await list.push(first)
  await list.push(second)

  t.is(null, await list.prev(first))
  t.is(first, await list.prev(second))
})

test("next", async t => {
  const prefix = v4()
  const list = new List(prefix, t)

  const [first, second] = [v4(), v4()]
  await list.push(first)
  await list.push(second)

  t.is(second, await list.next(first))
  t.is(null, await list.next(second))
})

test("after: when not at tail", async t => {
  const prefix = v4()
  const list = new List(prefix, t)

  const [first, second] = [v4(), v4()]
  await list.push(first)
  await list.push(second)

  t.is(second, await list.after(first))
})

test("after: when at tail", async t => {
  const prefix = v4()
  const list = new List(prefix, t)

  const [first, second] = [v4(), v4()]
  await list.push(first)
  await list.push(second)

  t.is(first, await list.after(second))
})

test("before: when not at head", async t => {
  const prefix = v4()
  const list = new List(prefix, t)

  const [first, second] = [v4(), v4()]
  await list.push(first)
  await list.push(second)

  t.is(first, await list.before(second))
})

test("before: when at head", async t => {
  const prefix = v4()
  const list = new List(prefix, t)

  const [first, second] = [v4(), v4()]
  await list.push(first)
  await list.push(second)

  t.is(second, await list.before(first))
})
