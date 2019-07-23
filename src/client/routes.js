import Games from "./components/games"
import Login from "./components/login"
import Signup from "./components/signup"
import Profile from "./components/profile"
import History from "./components/history"

const routes = [
  { path: "/", component: Games },
  { path: "/login", component: Login },
  { path: "/signup", component: Signup },

  { path: "/user/:uuid", name: "user", component: Profile },
  { path: "/game/:uuid", name: "game", component: History },

  { path: "*", redirect: "/" }
]

export default routes
