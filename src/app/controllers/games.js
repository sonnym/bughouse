import Game from "~/app/models/game"

export const index = async ({ params }, res, next) => {
  try {
    const games = await Game.forUser(params.userUUID)

    res.status(200).send(await games.serialize())
  } catch(err) {
    res.status(404).end()
    next(err)
  }
}
