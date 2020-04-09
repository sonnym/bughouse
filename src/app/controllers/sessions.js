import User from "~/app/models/user"

export const create = async (req, res, next) => {
  const { email, password } = req.body

  if (!email || !password) {
    res.status(400).end()
    return
  }

  const loadedUser = await User.query(builder => {
    builder
      .innerJoin('emails', 'emails.user_id', 'users.id')
      .where('emails.value', '=', email)
      .limit(1)
  }).fetch({
    require: false,
    withRelated: ["profile"]
  })

  const user = loadedUser || new User()

  if (await user.isValidPassword(password)) {
    req.login(user, (err) => {
      if (err) next(err)

      res.status(201).send(user.serialize())
    })
  } else {
    res.status(401).end()
  }
}

export const destroy = async (req, res, next) => {
  await req.session.destroy()
  res.status(205).end()
}
