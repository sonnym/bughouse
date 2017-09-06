import Sequelize from "sequelize"
import { orm } from "./../../server/database"

import { inspect } from "util"

const define = orm.define.bind(orm)

export default definition => definition(define, Sequelize)

export const __useDefault = true
