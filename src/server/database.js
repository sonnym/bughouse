import Sequelize from "sequelize"

import config from "./../../config/sequelize.config"

import loggerServer from "./logger"
import { environment, isDevelopment, isTest } from "./../share/environment"

const logger = loggerServer()
const commonConfig = {
  benchmark: isDevelopment() || isTest(),
  logging: (msg, ms) => logger.info(`Executed SQL (${ms} ms): ${msg}`)
}

let orm = new Sequelize(Object.assign({}, commonConfig, config[environment]))

const connect = () => orm.authenticate()
const inject = (config) => {
  orm = new Sequelize(Object.assign({}, commonConfig, config))
}

export { orm, connect, inject }
