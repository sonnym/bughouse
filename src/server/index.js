import { inspect } from "util"

import express from "express"
import bodyParser from "body-parser"
import session from "express-session"

import passport from "passport"

import { isDevelopment } from "./../share/environment"

import loggerServer from "./logger"
import socketServer from './socket'

process.on("uncaughtException", (err) => {
  if (isDevelopment()) {
    /* eslint-disable no-console */
    console.log("EXCEPTION:")
    console.log(inspect(err))
    /* eslint-enable no-console */
  }
})

const app = express()

export const logger = loggerServer()
export const socketHook = SocketHandler => socketServer(app, SocketHandler)
export const routerHook = RouterHandler => RouterHandler(app, express.Router)
export const authenticationHook = AuthenticationHandler => AuthenticationHandler(passport)

export function startServer(port = 3000) {
  app.use((req, res, next) => {
    res.on("finish", () => {
      logger.info({ req, res }, `[${req.method}] (${req.ip}) ${req.path} ${res.statusCode} ${res.get('Content-Length')}`)
    })

    next()
  })

  app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: 'yai1EMahjoh8ieC9quoo5ij3JeeKaiyaix1aik6ohbiT6ohJaex0roojeifahkux'
  }))
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(passport.initialize())
  app.use(passport.session())

  app.use(express.static("public"))

  app.listen(port, () => logger.info(`Listening on port ${port}`))

  return app
}
