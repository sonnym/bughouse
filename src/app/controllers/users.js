import User from "./../models/user"

export const index = async (req, res) => res.json(await User.fetchAll())

export const create = async (req, res) => {
  let user = User.forge(req.body)

  if (await user.save()) {
    res.user = user
    res.location("/")
  } else {
    res.location("/")
  }

  res.end()
}

export const show = (req, res) => res.json(req.user)
export const update = (req, res) => res.json({ })
export const destroy = (req, res) => res.json(req.user.destroy())
