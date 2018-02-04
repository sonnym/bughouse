import User from "./../models/user"

export const create = async (req, res) => {
  const {email, password} = req.body
  const user = await User.query({ email }).fetchOne()

  if (user && await user.isValidPassword(password)) {
    res.redirect("/")
  } else {
    res.redirect("/")
  }
}
