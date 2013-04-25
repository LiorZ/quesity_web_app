define(['models/QuestPage','models/QuestPageCollection','Backbone','BackboneRelational'],function(QuestPage,QuestPageCollection,Backbone,BackboneRelational) {
	var Quest = Backbone.RelationalModel.extend({
		relations: [{
			type: Backbone.HasMany,
			key: 'pages',
			collectionType: QuestPageCollection,
			relatedModel: QuestPage,
			reverseRelation: {
				key: 'quest',
				keySource:'quest_id',
				includeInJSON: 'quest_id'
			}
		}],
		defaults:{
			title:'Untitled Quest'
		},
		idAttribute: "_id",
		initialize:function(options) {
//			var pages = new QuestPageCollection();
//			this.set('pages',pages);
//			this.listenTo(pages,'add',this.add_self_reference); <-- Due to moving to BackboneRelational
		},
		url:function() {
			if (this.isNew()){
				return '/new_quest';
			}else {
				return '/quest/'+this.get('_id');
			}
		},
//		add_self_reference:function(page) {
//			page.set('quest',this);
//		}
	});
	
	return Quest;
});