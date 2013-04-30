define(['models/globals','models/QuestPageLocation','models/HintCollection','models/LinkLocationCollection','models/QuestPage'],
		function(globals,QuestPageLocation,HintCollection,LinkLocationCollection,QuestPage) {
	var QuestPageSurprise = QuestPageLocation.extend({
		initialize:function(options) {
			QuestPageLocation.prototype.initialize.apply(this, [options]);
		},
		
	});
	globals.QuestPageSurprise = QuestPageSurprise;
	return QuestPageSurprise;

});

