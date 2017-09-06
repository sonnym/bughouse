import { join } from "path"

import Sequelize from "sequelize"
import Umzug from "umzug"

import loggerServer from "./../../src/server/logger"
import { inject, connect } from "./../../src/server/database"

const logger = loggerServer()

const orm = inject({
  database: `bughouse_test_${process.pid}`,
  dialect: "sqlite",
  storage: ":memory:",
  retry: {
    max: 0
  }
})

const umzug = new Umzug({
  sequelize: orm,
  logging: logger.info.bind(logger),
  path: join(process.cwd(), "db", "schema.json"),
  migrations: {
    path: join(process.cwd(), "db", "migrations"),
    params: [orm.getQueryInterface(), Sequelize]
  }
})

export default async () => {
  await connect()
  await umzug.up()
}

export const __useDefault = true
