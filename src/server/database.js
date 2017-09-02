import Sequelize from "sequelize"

import config from "./../../config/sequelize.config"
import { environment } from "./../share/environment"

const connection = new Sequelize(config[environment])

export { connection }
export default connection.authenticate()

export const __useDefault = true
