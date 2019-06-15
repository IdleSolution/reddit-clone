var env = process.env.NODE_ENV || "development";
var config = require("./knex-stages")[env];

module.exports = require("knex")(config);
