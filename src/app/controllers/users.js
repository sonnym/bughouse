import User from "./../models/user"

export const index = async (req, res) => res.json(await User.fetchAll())
export const create = (req, res) => res.json({ })
export const show = (req, res) => res.json(req.user)
export const update = (req, res) => res.json({ })
export const destroy = (req, res) => res.json(req.user.destroy())
