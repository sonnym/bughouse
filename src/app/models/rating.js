import Model from "./base"

import { DRAW, WHITE_WIN, BLACK_WIN } from "~/share/constants/results"

const K = 20

export default class Rating extends Model {
  get tableName() {
    return "ratings"
  }

  get hasTimestamps() {
    return true
  }

  static async calculate(game) {
    const result = game.get("result")

    const whiteUser = game.related("whiteUser")
    const blackUser = game.related("blackUser")

    await whiteUser.refresh({ withRelated: ["rating"] })
    await blackUser.refresh({ withRelated: ["rating"] })

    const whiteRating = whiteUser.related("rating").get("value")
    const blackRating = blackUser.related("rating").get("value")

    let whiteRatingNew, blackRatingNew

    if (result === DRAW) {
      [whiteRatingNew, blackRatingNew] = draw(whiteRating, blackRating)

    } else if (result === WHITE_WIN) {
      [whiteRatingNew, blackRatingNew] = decision(whiteRating, blackRating)

    } else if (result === BLACK_WIN) {
      [blackRatingNew, whiteRatingNew] = decision(blackRating, whiteRating)
    }

    return [
      this.forge({
        user_id: whiteUser.get("id"),
        game_id: game.get("id"),
        value: whiteRatingNew
      }),

      this.forge({
        user_id: blackUser.get("id"),
        game_id: game.get("id"),
        value: blackRatingNew
      })
    ]
  }
}

function decision(ratingWinner, ratingLoser) {
  const ratingDifference = Math.abs(ratingWinner - ratingLoser)

  const probabilityWinner = probabilityOfWin(ratingDifference)
  const probabilityLoser = 1 - probabilityWinner

  return [
    ratingWinner + ((1 - probabilityWinner) * K),
    ratingLoser + ((0 - probabilityLoser) * K)
  ]
}

function draw(ratingWhite, ratingBlack) {
  const ratingDifference = Math.abs(ratingWhite - ratingBlack)

  const probabilityWhite = probabilityOfWin(ratingDifference)
  const probabilityBlack = 1 - probabilityWhite

  return [
    ratingWhite + ((0.5 - probabilityWhite) * K),
    ratingBlack + ((0.5 - probabilityBlack) * K)
  ]
}

function probabilityOfWin(ratingDifference) {
  return +(1 / (1 + Math.pow(10, ratingDifference / 400))).toFixed(2)
}
