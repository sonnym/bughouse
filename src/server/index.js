import { inspect } from "util"

import express from "express"
import bodyParser from "body-parser"

import redis from "redis"
import session from "express-session"
import connectRedis from "connect-redis"

import passport from "passport"

import { reject, isNil } from "ramda"

import { isDevelopment } from "~/share/environment"

import makeLogger from "~/share/logger"
import socketServer from './socket'

const logger = makeLogger("express")

export function startServer(port = 3000, opts = {}) {
  const app = express()

  useLoggerHandler(app)
  useSessionsHandler(app)

  app.use(express.static("public"))

  app.use(bodyParser.json({ type: "*/*" }))
  app.use(passport.initialize())
  app.use(passport.session())

  useOptionalHandlers(app, opts)
  useFallbackHandler(app)

  app.listen(port, () => logger.info(`Listening on port ${port}`))

  return app
}

function useLoggerHandler(app) {
  app.use((req, res, next) => {
    const start = new Date()
    const path = reject(isNil, [req.baseUrl, req.path]).join("")

    logger.info(`[${req.method}] (${req.ip}) ${path}`)

    res.on("finish", () => {
      const end = new Date()
      logger.info(`[${res.statusCode}] ${res.get('Content-Length') || 0} bytes in ${end - start} seconds`)
    })

    next()
  })

}

function useSessionsHandler(app) {
  const redisClient = redis.createClient({
    host: "127.0.0.1",
    port: 6379,
    db: 0
  })
  redisClient.unref()
  redisClient.on("error", (error) => logger.error({ type: "redis", error }))

  app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: 'yai1EMahjoh8ieC9quoo5ij3JeeKaiyaix1aik6ohbiT6ohJaex0roojeifahkux',
    store: new (connectRedis(session))({ client: redisClient })
  }))
}

function useOptionalHandlers(app, opts) {
  if (opts.SocketHandler) {
    socketServer(app, opts.SocketHandler)
  }

  if (opts.RouteHandler) {
    opts.RouteHandler(app, express.Router)
  }

  if (opts.AuthenticationHandler) {
    opts.AuthenticationHandler(passport)
  }
}

function useFallbackHandler(app) {
  app.use((err, req, res, _next) => {
    res.status(500).end()

    if (isDevelopment()) {
      logger.error(inspect(err))
    }
  })
}

export { logger }
