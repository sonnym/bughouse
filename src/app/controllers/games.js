import Game from "~/app/models/game"

export const show = async ({ params }, res, next) => {
  try {
    const game = await Game.where({ uuid: params.uuid }).fetch()

    res.status(200).send(await game.serialize())
  } catch(err) {
    res.status(404).end()
    next(err)
  }
}
