Gourdian = function() { };

  ///////////////
 // constants //
///////////////
exports.ROOT = require("path").join(__dirname, "..");

  /////////////
 // modules //
/////////////
exports.logger = require("./logger");
exports._ = require("underscore");

  ///////////////
 // functions //
///////////////
exports.deep_insepct = function(o) { return require("util").inspect(o, true, null) };
