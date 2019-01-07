import { logger } from "./../server/index"

import User from "./models/user"

export default (passport) => {
  passport.serializeUser((user, done) => done(null, user.get("uuid")))

  passport.deserializeUser(async (uuid, done) => {
    logger.info(`Negotiating session for ${uuid}`)
    done(null, await User.where({ uuid }).fetch())
  })
}
