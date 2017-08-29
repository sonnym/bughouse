let config = require("./development.pm2.config.js")

config.apps.push({
  "name": "simulation",
  "script": "./src/simulation.js",
  "interpreter": "./node_modules/.bin/babel-node",
  "watch": ["src/simulation"],
  "ignore_watch": ["*"],
  "watch_options": {
    "usePolling": true,
    "alwaysStat": true,
    "useFsEvents": false
  },
  "args": "200"
})

module.exports = config
