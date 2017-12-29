import bodyParser from "body-parser"

import * as UsersController from "./controllers/users"

export default (app, Router) => {
  app.use(bodyParser.urlencoded())

  return app.use("/users", routeController(UsersController, new Router()))
}

export const __useDefault = true

const routeController = (Controller, router) => {
  router.param("uuid", async (req, res, next, uuid) => {
    req.user = await User.findOne({ where: { uuid } })
    next()
  })

  Object.entries(Controller).map(([name, fn]) => {
    switch(name) {
      case "index":
        router.get("/", fn)
        break
      case "create":
        router.post("/", fn)
        break
      case "show":
        router.get(":uuid", fn)
        break
      case "update":
        router.put(":uuid", fn)
        break
      case "destroy":
        router.delete(":uuid", fn)
        break
    }
  })

  return router
}
