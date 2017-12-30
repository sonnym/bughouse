import Email from "./../models/email"
import User from "./../models/user"

export const index = async (req, res) => res.json(await User.fetchAll())

export const create = async (req, res) => {
  const params = req.body || { }

  const user = User.forge(userParams(params))
  const email = Email.forge(Object.assign({ user }, emailParams(params)))

  if (await email.save()) {
    res.user = user
    res.location("/")
  } else {
    res.location("/")
  }

  res.end()
}

export const show = (req, res) => res.json(req.user)
export const update = (req, res) => res.json({ })
export const destroy = (req, res) => res.json({ })

function userParams({ password }) {
  return { password }
}

function emailParams({ email }) {
  return { value: email }
}
