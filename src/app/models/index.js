import { orm } from "./../../server/database"

export default definition => orm.Model.extend(definition)

export const __useDefault = true
