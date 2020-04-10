import ViewKibitz from "./components/ViewKibitz"
import ViewLeaderboard from "./components/ViewLeaderboard"

import ViewLogin from "./components/ViewLogin"
import ViewSignup from "./components/ViewSignup"

import ViewProfile from "./components/ViewProfile"
import ViewHistory from "./components/ViewHistory"

const routes = [
  { path: "/", name: "home", component: ViewKibitz },
  { path: "/leaderboard", name: "leaderboard", component: ViewLeaderboard },

  { path: "/login", component: ViewLogin },
  { path: "/signup", component: ViewSignup },

  { path: "/user/:uuid", name: "user", component: ViewProfile },
  { path: "/game/:uuid", name: "game", component: ViewHistory },

  { path: "*", redirect: "/" }
]

export default routes
