import { logger } from "~/server/index"

import User from "./models/user"

export default (passport) => {
  passport.serializeUser((user, done) => { done(null, user.get("id")) })

  passport.deserializeUser(async (id, done) => {
    logger.debug(`Negotiating session for ${id}`)
    done(null, await User.where({ id }).fetch())
  })
}
