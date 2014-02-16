define(['models/QuestPage','models/QuestPageCollection','Backbone','BackboneRelational','models/Mixins'],
		function(QuestPage,QuestPageCollection,Backbone,BackboneRelational,Mixins) {
	var StartingLocation = Backbone.RelationalModel.extend({
		defaults:{
			lat:undefined,
			lng:undefined,
			radius:20,
			street:''
		}
	});
	
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
		},
			{
				type: Backbone.HasOne,
				key:'starting_location',
				relatedModel:StartingLocation
			}
		],
		defaults:{
			title:'Untitled Quest',
			description:'',
			tags:[],
			images:[],
			allowed_hints:3,
			allowed_public_questions:3,
			allowed_location_finders:3,
			games_played:10,
			rating:1,
			distance:5,
			time:60,
			map_url:''
		},
		idAttribute: "_id",
		initialize:function(options) {
			if ( _.isNull(this.get('starting_location')) ) {
				this.set('starting_location',new StartingLocation());
			}
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