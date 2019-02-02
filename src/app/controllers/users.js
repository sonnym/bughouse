import User from "~/app/models/user"

export const create = async (req, res, next) => {
  try {
    const user = await User.create(req.body || { })
    await user.refresh()

    req.login(user, async (err) => {
      if (err) next(err)
      res.status(201).send(await user.serialize())
    })
  } catch(err) {
    res.status(400).end()
    next(err)
  }
}

export const show = async ({ params }, res, next) => {
  try {
    const user = await new User({ uuid: params.uuid }).fetch()

    if (user) {
      res.status(200).send(await user.serialize())
    } else {
      res.status(404).end()
    }
  } catch(err) {
    next(err)
  }
}
