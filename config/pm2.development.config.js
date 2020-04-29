module.exports = {
  "apps" : [{
    "name": "express",
    "script": "./src/app/index.js",
    "interpreter": "./node_modules/.bin/babel-node",
    "watch": ["src/server/**/*.js", "src/app/**/*.js", "babel.config.js"],
    "watch_options": {
      "usePolling": true,
      "alwaysStat": true,
      "useFsEvents": false
    },
    "env": {
      "NODE_ENV": "development",

      "REDIS_SESSION_STORE_URL": "redis://localhost:6379/0",
      "REDIS_APPLICATION_STORE_URL":  "redis://localhost:6379/1"
    }

  }, {
    "name": "webpack",
    "script": "./node_modules/.bin/webpack-dev-server",
    "watch": ["config/webpack.config.js"],
    "args": "--watch --cache --config config/webpack.config.js",
    "env": {
      "NODE_ENV": "development"
    }

  }, {
    "name": "simul",
    "script": "./src/simul/index.js",
    "interpreter": "./node_modules/.bin/babel-node",
    "watch": ["src/simul/**/*.js", "babel.config.js"],
    "watch_options": {
      "usePolling": true,
      "alwaysStat": true,
      "useFsEvents": false
    },
    "env": {
      "NODE_ENV": "development"
    }

  }, {
    "name": "filebeat",
    "script": "sudo filebeat --path.config=config --strict.perms=false run",
    "watch": ["config/filebeat.yml"]
  }]
}
