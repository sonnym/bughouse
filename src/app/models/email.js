import model from "./index"

export default model((define, {UUID}) => {
  return define("Email", {
    uuid: UUID,
  })
})

