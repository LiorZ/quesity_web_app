module.exports = function(mongoose) {

	var models = {};
	mongoose.models = {};
	mongoose.modelSchemas = {};
	
	models.Quest = require('./Quest')(mongoose);
	models.Account = require('./Account')(mongoose,models.Quest);
	models.Feedback = require('./Feedback')(mongoose);
	models.Game = require('./Game')(mongoose,models.Quest);
	models.UsageCode = require('./UsageCode')(mongoose);
	var _ = require('underscore');
	var extend = require('mongoose-schema-extend');

	models.QuestPage = require('./QuestPage')(mongoose,extend,_);
	return models;
};
