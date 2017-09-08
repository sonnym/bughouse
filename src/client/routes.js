import Games from "./components/games"
import Login from "./components/login"

const routes = [
  { path: "/", component: Games },
  { path: "/login", component: Login },

  { path: "*", redirect: { to: "/" } }
]

export default routes
