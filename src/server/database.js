import Sequelize from "sequelize"

import config from "./../../config/sequelize.config"
import { environment } from "./../share/environment"

let orm = new Sequelize(config[environment])

const connect = () => orm.authenticate()
const inject = (config) => {
  const original = orm
  orm = new Sequelize(config)
}

export { orm, connect, inject }
