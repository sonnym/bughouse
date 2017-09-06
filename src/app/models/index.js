import Sequelize from "sequelize"
import { orm } from "./../../server/database"

import { inspect } from "util"

export default definition => definition(orm.define.bind(orm), Sequelize)

export const __useDefault = true
