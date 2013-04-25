define(['models/globals','models/QuestPageLocation','models/HintCollection','models/LinkLocationCollection','models/QuestPage'],
		function(globals,QuestPageLocation,HintCollection,LinkLocationCollection,QuestPage) {
	var QuestPageSurprise = QuestPageLocation.extend({
		initialize:function(options) {
			this.constructor.__super__.initialize.apply(this, [options]);
		},
		
	});
//	_.extend(QuestPageSurprise.prototype.defaults, QuestPageLocation.prototype.defaults);
	QuestPage._subModels['surprise'] = QuestPageSurprise;
	globals.QuestPageSurprise = QuestPageSurprise;
	return QuestPageSurprise;

});

