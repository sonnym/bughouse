import User from "./../models/user"

export const index = async (req, res) => await res.json(User.findAll().map(user => user.get({ plain: true })))
export const create = (req, res) => res.json({ })
export const show = (req, res) => res.json(req.user.get({ plain: true }))
export const update = (req, res) => res.json({ })
export const destroy = (req, res) => res.json(req.user.destroy())
