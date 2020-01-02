import User from "~/app/models/user"

export const create = async (req, res, next) => {
  try {
    const user = await User.create(req.body)
    await user.refresh()

    req.login(user, async (err) => {
      if (err) next(err)
      res.status(201).send(user.serialize())
    })
  } catch(err) {
    res.status(400).end()
    next(err)
  }
}

export const show = async ({ params }, res, next) => {
  try {
    const user = await User
      .forge({ uuid: params.uuid })
      .fetch()

    res.status(200).send(user.serialize())
  } catch(err) {
    res.status(404).end()
    next(err)
  }
}
