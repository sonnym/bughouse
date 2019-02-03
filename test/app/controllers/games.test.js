import test from "ava"

import Factory from "@/factory"

import * as GamesController from "~/app/controllers/games"

test.serial("unsuccessful index", async t => {
  const user = await Factory.user()

  await GamesController.index(
    Factory.req({ userUUID: user.get("uuid") }),
    Factory.res(t, 404),
    Factory.next(t)
  )
})

test.serial("successful index", async t => {
  const game = await Factory.game()
  const user = game.whiteUser()

  await user.refresh()

  await GamesController.index(
    Factory.req({ userUUID: user.get("uuid") }),
    Factory.res(t, 200),
    Factory.next(t)
  )
})
