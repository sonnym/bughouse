import { connection } from "./../../src/server/database"

export default test => {
  test.before("migrate database", async t => await connection.migrate.latest())
}

export const __useDefault = true
