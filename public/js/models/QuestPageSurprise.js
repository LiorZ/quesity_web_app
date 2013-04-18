define(['models/QuestPage','models/HintCollection','models/LinkLocationCollection','models/QuestPageLocation'],
		function(QuestPage,HintCollection,LinkLocationCollection,QuestPageLocation) {
	var QuestPageSurprise = QuestPage.extend({
		initialize:function(options) {
			this.constructor.__super__.initialize.apply(this, [options]);
			this.set('hints',new HintCollection());
			this.set('locations',new LinkLocationCollection());
			this.listenTo(this.get('locations'),'add',this.handle_add_link);
		},
		
	});
	_.extend(QuestPageSurprise.prototype.defaults, QuestPageLocation.prototype.defaults);
	
	return QuestPageSurprise;

});

