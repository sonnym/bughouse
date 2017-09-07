import { join } from "path"

import Sequelize from "sequelize"
import Umzug from "umzug"

import loggerServer from "./../../src/server/logger"
import { inject, connect } from "./../../src/server/database"

const logger = loggerServer()

const databaseName = `bughouse_test_${process.pid}`
logger.info(`Creating database: ${databaseName}`)

const orm = inject({
  database: databaseName,
  dialect: "sqlite",
  storage: ":memory:",
  logging: (msg, ms) => logger.info(`Executed SQL on (${databaseName}) (${ms} ms): ${msg}`),
  retry: {
    max: 0
  }
})

const umzug = new Umzug({
  storage: "sequelize",
  logging: (msg) => logger.info(`Migration on (${databaseName}): ${msg}`),
  migrations: {
    path: join(process.cwd(), "db", "migrations"),
    params: [orm.getQueryInterface(), Sequelize]
  },
  storageOptions: {
    sequelize: orm,
  }
})

const connectAndMigrate = async () => {
  await connect()
  await umzug.up()
}

export default test => {
  test.before("set up database connnection", async t => await connectAndMigrate())
  test.beforeEach("truncate all tables", async t => await orm.truncate())
  test.after.always("close database connection", t => orm.close())
}

export const __useDefault = true
