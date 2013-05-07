define(['models/globals','models/LinkLocation','models/QuestPage'],function(globals,LinkLocation,QuestPage){
	
	var QuestPageLocation = QuestPage.extend({
		initialize:function(options) {
			QuestPage.prototype.initialize.apply(this, [options]);
		},
	});
	//Lior: Fixes an issue in which a circular dep was needed in order to define the sub models.. ugly, but in the mean time it works.
	globals.QuestPageLocation = QuestPageLocation;
	return QuestPageLocation;
	
});