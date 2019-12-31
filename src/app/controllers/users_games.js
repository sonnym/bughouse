import User from "~/app/models/user"
import Game from "~/app/models/game"

export const index = async ({ params }, res, next) => {
  try {
    const uuid = params.userUUID

    // eslint-disable-next-line no-unused-vars
    await User.forge({ uuid }).fetch()

    const games = await Game.forUser(uuid)
    const gamesData = games.map(game => game.serialize())

    res.status(200).send(gamesData)
  } catch(err) {
    res.status(404).end()
    next(err)
  }
}
