import test from "ava"

import Factory from "@/factory"

import * as GamesController from "~/app/controllers/games"

test("show with a valid uuid", async t => {
  const game = await Factory.game()

  await GamesController.show(
    Factory.req({ uuid: (await game.refresh()).get("uuid")}),
    Factory.res(t, 200, await game.serialize()),
    Factory.next(t)
  )
})

test("show with an invalid uuid", async t => {
  await GamesController.show(
    Factory.req({ uuid: "" }),
    Factory.res(t, 404, { }),
    Factory.next(t)
  )
})
