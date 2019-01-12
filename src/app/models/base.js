import { orm } from "./../../server/database"

export const transaction = orm.transaction.bind(orm)

export default orm.Model
