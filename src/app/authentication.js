import { logger } from "~/server/index"

import User from "./models/user"

export default (passport) => {
  passport.serializeUser((user, done) => { done(null, user.get("id")) })

  passport.deserializeUser(async (id, done) => {
    const identifier = `users.id=${id}`

    logger.debug({
      identifier,
      source: "HTTP",
      event: "AUTH",
      data: "Negotiating session"
    })

    try {
      logger.debug({
        identifier,
        source: "HTTP",
        event: "AUTH",
        data: "Session restored"
      })

      done(null, await User.where({ id }).fetch({
        withRelated: ["profile", "rating"]
      }))

    } catch {
      logger.debug({
        identifier,
        source: "HTTP",
        event: "AUTH",
        data: "Session denied"
      })

      done(null, false)
    }
  })
}
