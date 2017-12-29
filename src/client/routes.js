import Games from "./components/games"
import Login from "./components/login"
import Signup from "./components/signup"

const routes = [
  { path: "/", component: Games },
  { path: "/login", component: Login },
  { path: "/signup", component: Signup },

  { path: "*", redirect: { to: "/" } }
]

export default routes
