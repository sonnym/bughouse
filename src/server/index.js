import { inspect } from "util"

import express from "express"
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
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

export function startServer(port = 3000) {
  app.use((req, res, next) => {
    logger.info({ req }, `[${req.method}] (${req.ip}) ${req.path}`)
    next()
  })

  app.use(cookieParser())
  app.use(bodyParser.json())
  app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'yai1EMahjoh8ieC9quoo5ij3JeeKaiyaix1aik6ohbiT6ohJaex0roojeifahkux'
  }))
  app.use(passport.initialize())
  app.use(passport.session())

  app.use(express.static("public"), (req, res, next) => {
    if (res.outputSize === 0) {
      next()
    } else {
      logger.info({ req, res }, `Served static file: ${req.path}`)
    }
  })

  app.all("*", (req, res, next) => {
    logger.info({ req, res }, `Invalid request: ${req.path}`)
    next()
  })

  app.listen(port, () => logger.info(`Listening on port ${port}`))

  return app
}
