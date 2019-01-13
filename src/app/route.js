import * as UsersController from "./controllers/users"
import * as SessionsController from "./controllers/sessions"

export default (app, Router) => {
  app.use("/users", resources(UsersController, new Router()))
  app.use("/sessions", resource(SessionsController, new Router()))
}

const resources = (Controller, router) => {
  Object.entries(Controller).map(([name, fn]) => {
    switch(name) {
      case "index":
        router.get("/", fn)
        break
      case "create":
        router.post("/", fn)
        break
      case "show":
        router.get("/:uuid", fn)
        break
      case "update":
        router.put("/:uuid", fn)
        break
      case "destroy":
        router.delete("/:uuid", fn)
        break
    }
  })

  return router
}

const resource = (Controller, router) => {
  Object.entries(Controller).map(([name, fn]) => {
    switch(name) {
      case "show":
        router.get("/", fn)
        break
      case "create":
        router.post("/", fn)
        break
      case "update":
        router.put("/", fn)
        break
      case "destroy":
        router.delete("/", fn)
        break
    }
  })

  return router
}
