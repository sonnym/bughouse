import { inspect } from "util"

import config from "./../../config/knex.config"

import knex from "knex"
import bookshelf from "bookshelf"

import makeLogger from "~/share/logger"
import { environment } from "~/share/environment"

const logger = makeLogger("express")

const connection = knex(config[environment])
const orm = bookshelf(connection)

connection.on("query", data => {
  logger.info(`[SQL]: ${data.sql} ${inspect(data.bindings || [])}`)
})

export { orm, connection }
