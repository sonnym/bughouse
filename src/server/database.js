import config from "./../../config/knex.config"

import knex from "knex"
import bookshelf from "bookshelf"

import loggerServer from "./logger"
import { environment, isDevelopment, isTest } from "./../share/environment"

const logger = loggerServer()
const commonConfig = {
  debug: isDevelopment() || isTest(),
  logging: (msg, ms) => logger.info(`Executed SQL (${ms} ms): ${msg}`),
}

const connection = knex(Object.assign({}, commonConfig, config[environment]))
const orm = bookshelf(connection)

export { orm, connection }
