import { join } from "path"

import Sequelize from "sequelize"
import Umzug from "umzug"

import { inject, connect } from "./../../src/server/database"

const orm = inject({
  database: `bughouse_test_${process.pid}`,
  dialect: "sqlite",
  storage: ":memory:"
})

const umzug = new Umzug({
  sequelize: orm,
  logging: console.log,
  path: join(process.cwd(), "db", "schema.json"),
  migrations: {
    path: join(process.cwd(), "db", "migrations"),
    params: [orm.queryInterface, Sequelize]
  }
})

export default async () => {
  connect()
  umzug.up()
}

export const __useDefault = true
