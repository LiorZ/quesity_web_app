define(['models/LinkLocationCollection','models/HintCollection','models/QuestPage'],function(LinkLocationCollection,HintCollection,QuestPage){
	var QuestPageLocation = QuestPage.extend({
		initialize:function(options) {
			this.constructor.__super__.initialize.apply(this, [options]);
			this.set('hints',new HintCollection());
			this.set('locations',new LinkLocationCollection());
		},
		defaults:
		 {
			locations: undefined,
			hints: undefined
		},
		
	});
	_.extend(QuestPageLocation.prototype.defaults, QuestPage.prototype.defaults);
	
	return QuestPageLocation;
	
});


