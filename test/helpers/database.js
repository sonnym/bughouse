import { join } from "path"

import Sequelize from "sequelize"
import Umzug from "umzug"

import loggerServer from "./../../src/server/logger"
import { orm, connect } from "./../../src/server/database"

const logger = loggerServer()

const connectAndSync = async () => {
  await connect()
  await orm.sync()
}

export default test => {
  test.before("set up database connnection", async t => await connectAndSync())
  test.beforeEach("truncate all tables", async t => await orm.truncate())
  test.after.always("close database connection", t => orm.close())
}

export const __useDefault = true
