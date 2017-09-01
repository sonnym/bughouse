module.exports = {
  "apps" : [{
    "name": "express",
    "script": "./src/server/index.js",
    "interpreter": "./node_modules/.bin/babel-node",
    "watch": ["src/server"],
    "ignore_watch": ["*", "*.sw*"],
    "watch_options": {
      "usePolling": true,
      "alwaysStat": true,
      "useFsEvents": false
    },
    "env": {
        "NODE_ENV": "development"
    }
  }, {
		"name": "webpack",
		"script": "./node_modules/.bin/webpack",
    "watch": false,
    "args": "--watch --cache --config config/webpack.config.js"
	}]
}
