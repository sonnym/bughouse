import model from "./index"
import User from "./user"

export default model((define, {UUID, INTEGER}) => {
  return define("Profile", {
    uuid: UUID,

    userId: {
      type: INTEGER,

      references: {
        model: User,
        key: "id"
      }
    }
  })
})
