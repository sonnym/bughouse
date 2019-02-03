import Game from "~/app/models/game"

export const index = async ({ params }, res, next) => {
  try {
    const games = await Game.forUser(params.userUUID)
    const gamesData = await Promise.all(games.map(game => game.serialize()))

    res.status(200).send(gamesData)
  } catch(err) {
    res.status(404).end()
    next(err)
  }
}
