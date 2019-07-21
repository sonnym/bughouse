import * as UsersController from "./controllers/users"
import * as SessionsController from "./controllers/sessions"

import * as UsersGamesController from "./controllers/users_games"
import * as GamesController from "./controllers/games"

export default (app, Router) => {
  app.use("/users", resources(UsersController, new Router()))
  app.use("/sessions", resource(SessionsController, new Router()))

  app.use("/users/:userUUID/games", resources(UsersGamesController, new Router({ mergeParams: true })))
  app.use("/games", resources(GamesController, new Router({ mergeParams: true })))
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
