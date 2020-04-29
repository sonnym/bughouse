import { logger } from "~/server/index"

import User from "./models/user"

export default (passport) => {
  passport.serializeUser((user, done) => { done(null, user.get("id")) })

  passport.deserializeUser(async (id, done) => {
    logger.debug(`[AUTH]: Negotiating session for (users.id=${id})`)

    try {
      logger.debug("[AUTH]: Session restored")
      done(null, await User.where({ id }).fetch({
        withRelated: ["profile", "rating"]
      }))

    } catch {
      logger.debug("[AUTH]: Session denied")
      done(null, false)
    }
  })
}
