import User from "./../models/user"

export const index = async (req, res) => res.json(await User.fetchAll())

export const create = async (req, res, next) => {
  try {
    const user = await User.createWithPassword(req.body || { })
    await user.refresh()

    req.login(user, async (err) => {
      if (err) next(err)
      res.status(201).send(await user.serialize())
    })
  } catch(e) {
    res.status(400).end()
  }
}

export const show = (req, res) => res.json(req.user)
export const update = (req, res) => res.json({ })
export const destroy = (req, res) => res.json({ })
