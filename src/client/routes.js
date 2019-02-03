import Games from "./components/games"
import Login from "./components/login"
import Signup from "./components/signup"
import Profile from "./components/profile"

const routes = [
  { path: "/", component: Games },
  { path: "/login", component: Login },
  { path: "/signup", component: Signup },

  { path: "/user/:uuid", name: "user", component: Profile },

  { path: "*", redirect: "/" }
]

export default routes
