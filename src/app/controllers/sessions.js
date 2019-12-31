import User from "~/app/models/user"

export const create = async (req, res, next) => {
  const {email, password} = req.body
  const user = await User.query(builder => {
    builder
      .innerJoin('emails', 'emails.user_id', 'users.id')
      .where('emails.value', '=', email)
      .limit(1)
    }).fetch({
      withRelated: ["profile"]
    })

  if (user && await user.isValidPassword(password)) {
    req.login(user, async (err) => {
      if (err) next(err)
      res.status(201).send(await user.serialize())
    })
  } else {
    res.status(401).end()
  }
}

export const destroy = async (req, res, next) => {
  await req.session.destroy()
  res.status(205).end()
}
