import User from "./../models/user"

export const create = async (req, res) => {
  const {email, password} = req.body
  const user = await User.query(builder => {
    builder
      .innerJoin('emails', 'emails.user_id', 'users.id')
      .where('emails.value', '=', email)
      .limit(1)
    }).fetch()

  if (user && await user.isValidPassword(password)) {
    res.status(201).end()
  } else {
    res.status(401).end()
  }
}
