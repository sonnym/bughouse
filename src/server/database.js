import config from "./../../config/knex.config"

import knex from "knex"
import bookshelf from "bookshelf"

import loggerServer from "./logger"
import { environment, isDevelopment, isTest } from "./../share/environment"

const logger = loggerServer()

const connection = knex(config[environment])
const orm = bookshelf(connection)

connection.on("query", data => logger.info({ data }, `Executed SQL: ${data.sql}`))

export { orm, connection }
