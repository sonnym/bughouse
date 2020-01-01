import ViewKibitz from "./components/ViewKibitz"
import ViewLogin from "./components/ViewLogin"
import ViewSignup from "./components/ViewSignup"
import ViewProfile from "./components/ViewProfile"
import ViewHistory from "./components/ViewHistory"

const routes = [
  { path: "/", component: ViewKibitz },
  { path: "/login", component: ViewLogin },
  { path: "/signup", component: ViewSignup },

  { path: "/user/:uuid", name: "user", component: ViewProfile },
  { path: "/game/:uuid", name: "game", component: ViewHistory },

  { path: "*", redirect: "/" }
]

export default routes
