import { execSync } from "child_process"

import test from "ava"

import { environment } from "./../../src/share/environment"
import config from "./../../config/sequelize.config"

import orm, { connection } from "./../../src/server/database"

const testConfig = config[environment]

test.before("creating test database", t => {
  execSync(`createdb ${testConfig.database}`)
})

test.after.always("dropping the test database", t => {
  execSync(`dropdb ${testConfig.database}`)
})

test("connection can be established", async t => {
  t.plan(1)

  await orm.then(() => {
    connection.close()

    t.pass("Successful database connection")
  })
})
