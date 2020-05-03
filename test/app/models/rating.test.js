import test from "ava"

import { forEach } from "ramda"

import { sample } from "@/core"
import Factory from "@/factory"

import Rating from "~/app/models/rating"

import { DRAW, WHITE_WIN, BLACK_WIN } from "~/share/constants/results"

test("tableName method", t => {
  t.is(Rating.forge().tableName, "ratings")
})

test("hasTimestamps method", t => {
  t.true(Rating.forge().hasTimestamps)
})

test("calculate: creates new, unsaved, valid instances", async t => {
  const result = sample([DRAW, WHITE_WIN, BLACK_WIN])

  const game = await Factory.game({ result })
  await game.refresh({
    withRelated: ["whiteUser", "blackUser"]
  })

  const ratings = await Rating.calculate(game)

  forEach(async (rating) => {
    t.true(rating instanceof Rating)
    t.true(rating.isNew())

    t.truthy(await rating.save())
  }, ratings)
})

test("calculate: on draw", async t => {
  const result = DRAW

  const game = await Factory.game({ result })
  await game.refresh({ withRelated: ["whiteUser", "blackUser"] })

  const [whiteRating, blackRating] = await Rating.calculate(game)

  t.is(whiteRating.get("value"), 1200)
  t.is(blackRating.get("value"), 1200)
})

test("calculate: on white win", async t => {
  const result = WHITE_WIN

  const game = await Factory.game({ result })
  await game.refresh({ withRelated: ["whiteUser", "blackUser"] })

  const [whiteRating, blackRating] = await Rating.calculate(game)

  t.is(whiteRating.get("value"), 1210)
  t.is(blackRating.get("value"), 1190)
})

test("calculate: on black win", async t => {
  const result = BLACK_WIN

  const game = await Factory.game({ result })
  await game.refresh({ withRelated: ["whiteUser", "blackUser"] })

  const [whiteRating, blackRating] = await Rating.calculate(game)

  t.is(whiteRating.get("value"), 1190)
  t.is(blackRating.get("value"), 1210)
})
