define(['models/LinkLocation','models/QuestPage'],function(LinkLocation,QuestPage){
	
	var QuestPageLocation = QuestPage.extend({
		initialize:function(options) {
			this.constructor.__super__.initialize.apply(this, [options]);
		},
	});
	//Lior: Fixes an issue in which a circular dep was needed in order to define the sub models.. ugly, but in the mean time it works.
	QuestPage._subModels['location'] = QuestPageLocation;
	return QuestPageLocation;
	
});


