import * as UsersController from "./controllers/users"
import * as SessionsController from "./controllers/sessions"

export default (app, Router) => {
  app.use("/users", routeController(UsersController, new Router()))
  app.use("/sessions", routeController(SessionsController, new Router()))
}

const routeController = (Controller, router) => {
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
