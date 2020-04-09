import test from "ava"

import { v4 } from "uuid"

import Factory from "@/factory"

import * as SessionsController from "~/app/controllers/sessions"

test("create: 400 with empty request body", async t => {
  await SessionsController.create(
    { body: { } },
    Factory.res(t, 400),
    Factory.next(t)
  )
})

test("create: 401 with unknown e-mail", async t => {
  const email = v4()
  const password = v4()

  await SessionsController.create(
    { body: { email, password } },
    Factory.res(t, 401),
    Factory.next(t)
  )
})

test("create: 401 with invalid password", async t => {
  const email = `${v4()}@example.com`
  const password = v4()

  await Factory.user(email)

  await SessionsController.create(
    { body: { email, password } },
    Factory.res(t, 401),
    Factory.next(t)
  )
})

test("create: 201 with valid password", async t => {
  const email = `${v4()}@example.com`
  const password = v4()
  const displayName = v4()

  const login = (user, fn) => fn(null)
  const body = { email, password }

  const user = await Factory.user(email, password, displayName)
  const uuid = user.get("uuid")

  await SessionsController.create(
    { body, login },
    Factory.res(t, 201, {
      uuid,
      displayName,
      rating: 1200
    }),
    Factory.next(t)
  )
})
