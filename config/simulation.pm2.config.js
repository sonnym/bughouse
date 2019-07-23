let config = require("./development.pm2.config.js")

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
  "env": {
    "NODE_ENV": "development"
  }
})

module.exports = config
