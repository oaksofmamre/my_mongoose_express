"use strict";

const mongoose = require("mongoose");
var env = process.env.NODE_ENV || "development";
var config = require("./config/mongo")[env];

module.exports = () => {
	var envUrl = process.env[config.use_env_variable];
	var localUrl = `mongodb://${config.host}/${config.database}`;
	var mongoUrl = envUrl ? envUrl : localUrl;

	// DC: returning so that on the other side an react to the promise
	return mongoose.connect(mongoUrl);
};
