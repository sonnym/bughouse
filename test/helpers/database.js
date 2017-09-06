import { join } from "path"

import Sequelize from "sequelize"
import Umzug from "umzug"

import loggerServer from "./../../src/server/logger"
import { inject, connect as origConnect } from "./../../src/server/database"

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

export const connect = async () => {
  await origConnect()
  await umzug.up()
}

export const close = () => orm.close()
