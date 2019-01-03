import User from "./../models/user"

export const index = async (req, res) => res.json(await User.fetchAll())

export const create = async (req, res) => {
  if (await User.createWithPassword(req.body || { })) {
    res.redirect("/")
  } else {
    res.redirect("/")
  }
}

export const show = (req, res) => res.json(req.user)
export const update = (req, res) => res.json({ })
export const destroy = (req, res) => res.json({ })
