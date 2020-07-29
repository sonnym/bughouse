import { inspect } from "util"

import express from "express"
import bodyParser from "body-parser"

import redis from "redis"
import session from "express-session"
import connectRedis from "connect-redis"

import passport from "passport"

import { ApolloServer } from "apollo-server-express"

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

  app.listen(port, () => {
    logger.info({
      source: "Server",
      event: "Listening",
      identifier: `port=${port}`
    })
  })

  return app
}

function useLoggerHandler(app) {
  app.use((req, res, next) => {
    const start = new Date()
    const path = reject(isNil, [req.baseUrl, req.path]).join("")
    const identifier = `ip=${req.ip}`

    logger.info({
      identifier,
      source: "HTTP",
      event: "REQ",
      data: `${req.method} ${path}`
    })

    res.on("finish", () => {
      const end = new Date()

      logger.info({
        identifier,
        source: "HTTP",
        event: "RES",
        data: `${res.statusCode} ${res.get('Content-Length') || 0}b in  ${end - start}ms`
      })
    })

    next()
  })

}

function useSessionsHandler(app) {
  // TODO: use environment variables
  const redisClient = redis.createClient({
    url: process.env["REDIS_SESSION_STORE_URL"]
  })
  redisClient.unref()
  redisClient.on("error", error => logger.error({ source: "redis", data: error }))

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

  if (opts.graph) {
    const server = new ApolloServer(opts.graph)

    server.applyMiddleware({ app })
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
