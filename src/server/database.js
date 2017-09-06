import Sequelize from "sequelize"

import config from "./../../config/sequelize.config"
import { environment } from "./../share/environment"

const orm = new Sequelize(config[environment])

export { orm }
export default orm.authenticate()

export const __useDefault = true
