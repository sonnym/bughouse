let config = require("./development.pm2.config.js")

const playerCount = process.env["PLAYER_COUNT"]

config.apps.push({
  "name": "simulation",
  "script": "./src/simulation.js",
  "interpreter": "./node_modules/.bin/babel-node",
  "watch": ["src/simulation.js"],
  "ignore_watch": ["*"],
  "watch_options": {
    "usePolling": true,
    "alwaysStat": true,
    "useFsEvents": false
  },
  "args": playerCount,
  "env": {
    "NODE_ENV": "development"
  }
})

module.exports = config
