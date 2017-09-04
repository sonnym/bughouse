import model from "./index"

export default model((define, {UUID}) => {
  return define("User", {
    uuid: UUID
  })
})
