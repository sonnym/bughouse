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
      "NODE_PRESERVE_SYMLINKS": "1"
    }
  }, {
    "name": "webpack",
    "script": "./node_modules/.bin/webpack",
    "watch": ["config/webpack.config.js"],
    "args": "--watch --cache --config config/webpack.config.js",
    "env": {
      "NODE_ENV": "development"
    }
  }]
}
