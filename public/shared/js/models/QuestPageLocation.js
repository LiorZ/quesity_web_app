define(['models/globals','models/LinkLocation','models/QuestPage'],function(globals,LinkLocation,QuestPage){
	
	var QuestPageLocation = QuestPage.extend({
		initialize:function(options) {
			QuestPage.prototype.initialize.apply(this, [options]);
		},
	});
	globals.QuestPageLocation = QuestPageLocation;
	return QuestPageLocation;
	
});