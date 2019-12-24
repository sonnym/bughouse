import test from "ava"

import Factory from "@/factory"

import * as UsersGamesController from "~/app/controllers/users_games"

test.skip("unsuccessful index", async t => {
  const user = await Factory.user()

  await UsersGamesController.index(
    Factory.req({ userUUID: user.get("uuid") }),
    Factory.res(t, 404),
    Factory.next(t)
  )
})

test.serial("successful index", async t => {
  const game = await Factory.game()
  const user = game.whiteUser()

  await user.refresh()

  await UsersGamesController.index(
    Factory.req({ userUUID: user.get("uuid") }),
    Factory.res(t, 200),
    Factory.next(t)
  )
})
