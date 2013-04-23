define(['models/LinkLocation','models/Hint','models/QuestPage'],function(LinkLocation,Hint,QuestPage){
	
	var QuestPageLocation = QuestPage.extend({
		relations: [{
			type: Backbone.HasMany,
			key: 'locations',
			relatedModel: LinkLocation,
			reverseRelation: {
				key: 'parent_page',
				includeInJSON: '_id'
			}
		},
		{
			type: Backbone.HasMany,
			key: 'hints',
			relatedModel: Hint,
			reverseRelation: {
				key: 'parent_page',
				includeInJSON: '_id'
			}
		}],
		initialize:function(options) {
			this.constructor.__super__.initialize.apply(this, [options]);
//			this.set('hints',new HintCollection());
//			this.set('locations',new LinkLocationCollection());
		},
//		 {
//			locations: undefined,
//			hints: undefined
//		},
		
	});
	_.extend(QuestPageLocation.prototype.defaults, QuestPage.prototype.defaults);
	QuestPage._subModels['location'] = QuestPageLocation;
	return QuestPageLocation;
	
});


