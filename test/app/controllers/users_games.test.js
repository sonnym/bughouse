import test from "ava"

import { v4 } from "uuid"

import Factory from "@/factory"

import * as UsersGamesController from "~/app/controllers/users_games"

test("unsuccessful index", async t => {
  await UsersGamesController.index(
    Factory.req({ userUUID: v4() }),
    Factory.res(t, 404),
    Factory.next(t)
  )
})

test("successful index", async t => {
  const game = await Factory.game()
  const user = game.whiteUser()

  await user.refresh()

  await UsersGamesController.index(
    Factory.req({ userUUID: user.get("uuid") }),
    Factory.res(t, 200),
    Factory.next(t)
  )
})
