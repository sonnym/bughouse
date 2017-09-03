import Sequelize from "sequelize"
import { connection } from "./../../server/database"

import { inspect } from "util"

const define = connection.define.bind(connection)

export default definition => definition(define, Sequelize)

export const __useDefault = true
