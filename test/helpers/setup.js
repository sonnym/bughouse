import { inspect } from "util"

process.on("uncaughtException", (err) => {
  console.log("EXCEPTION:")
  console.log(inspect(err))
})
