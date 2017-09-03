import model from "./index"

export default model((define, {UUID}) => {
  console.log(`DEFINE: ${define}`)

  return define("User", {
    uuid: UUID
  })
})
