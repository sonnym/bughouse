import { join } from "path"

import Sequelize from "sequelize"
import Umzug from "umzug"

import loggerServer from "./../../src/server/logger"
import { inject, connect as origConnect } from "./../../src/server/database"

const logger = loggerServer()

const orm = inject({
  database: `bughouse_test_${process.pid}`,
  dialect: "sqlite",
  storage: ":memory:",
  retry: {
    max: 0
  }
})

console.log(join(process.cwd(), "db", "schema.json"))

const umzug = new Umzug({
  storage: "sequelize",
  logging: logger.info.bind(logger),
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
