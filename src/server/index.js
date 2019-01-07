import { inspect } from "util"

import express from "express"
import bodyParser from "body-parser"
import session from "express-session"
import connectRedis from "connect-redis"

import passport from "passport"

import { isDevelopment } from "./../share/environment"

import loggerServer from "./logger"
import socketServer from './socket'

export const logger = loggerServer()

export function startServer(port = 3000, opts = {}) {
  const app = express()

  app.use((req, res, next) => {
    res.on("finish", () => {
      logger.info({ req, res }, `[${req.method}] (${req.ip}) ${req.path} ${res.statusCode} ${res.get('Content-Length') || 0}`)
    })

    next()
  })

  app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: 'yai1EMahjoh8ieC9quoo5ij3JeeKaiyaix1aik6ohbiT6ohJaex0roojeifahkux',
    store: new (connectRedis(session))({
      url: "redis://127.0.0.1/6379"
    })
  }))
  app.use(bodyParser.json({ type: "*/*" }))
  app.use(passport.initialize())
  app.use(passport.session())

  if (opts.SocketHandler) {
    socketServer(app, opts.SocketHandler)
  }

  if (opts.RouteHandler) {
    opts.RouteHandler(app, express.Router)
  }

  if (opts.AuthenticationHandler) {
    opts.AuthenticationHandler(passport)
  }

  app.use(express.static("public"))

  app.use((err, req, res, _next) => {
    res.status(500).end()

    if (isDevelopment()) {
      logger.error(inspect(err))
    }
  })

  app.listen(port, () => logger.info(`Listening on port ${port}`))

  return app
}
