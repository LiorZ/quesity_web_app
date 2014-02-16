define(['models/globals','Backbone','models/Link','models/LinkCollection','BackboneRelational','models/Hint','models/HintCollection'],
		function(globals,Backbone,Link,LinkCollection,BackboneRelational,Hint,HintCollection) {
	
	var QuestPage = Backbone.RelationalModel.extend({
		idAttribute: "_id",
		relations: [{
			type: Backbone.HasMany,
			key: 'links',
			relatedModel: Link,
			collectionType:LinkCollection,
			collectionKey:'parent',
			reverseRelation: {
				key: 'parent_page',
				includeInJSON: false
			}
		},
		{
			type: Backbone.HasMany,
			key: 'hints',
			relatedModel: Hint,
			collectionType: HintCollection,
			includeInJSON: true,
			collectionKey:'parent',
			reverseRelation: {
				key:'parent_page',
				includeInJSON: false
			}
		}
		
		],
		
		subModelTypes:{
			'location':'QuestPageLocation',
			'question':'QuestPageQuestion',
			'stall':'QuestPageStall',
			'static':'QuestPageStatic',
			'surprise':'QuestPageSurprise',
			'open_question':'QuestPageOpenQuestion'
		},
		subModelTypeAttribute:'page_type',
		
		attach_listeners:function() {
			this.listenTo(this,"change:x change:page_name change:page_content",this.save_model);
//			this.listenTo(this.get('links'),'add remove change',this.save_model);
//			this.listenTo(this.get('hints'),'add remove change',this.save_model);
		},
		get_next_page: function() {
			throw new Error("This is an abstract function!");
		},
		save_model:function() {
			this.save(null,
				{
					error:function() {
						alert("Error: Could not save your diagram ");
					},
					silent:true
				});
		},
		url:function() {
			if (this.isNew()){
				return "/quest/"+this.collection.quest.get('_id') + '/new_page';
			}else { 
				var quest_id = this.get('quest').get('_id');
				return "/quest/" +quest_id+'/page/'+this.get('_id');
			}
		},
		toJSON:function() {
			var json = Backbone.RelationalModel.prototype.toJSON.apply(this, []);
			delete json['jointObj'];
			return json;
		},
		defaults: {
			x:220,
			y:220,
			page_name:"Untitled",
			page_type: "",
			page_number: 1,
			jointObj: undefined,
			page_content:'',
		},
		localAttrs: ['quest','jointObj'],
		get_linkable_pages: function() {
			var pages = this.get('quest').get('pages');
			var me = this;
			return pages.chain().filter( function(page) { return (
					page != me && 
					page.get('page_type') != 'surprise' 
			); } );
		},
		is_connected_to: function(page_id) {
			var links = this.get('links');
			if ( links === undefined || links.length === 0 )
				return false;
			var has = links.find(function(link) { return link.get('links_to_page').id == page_id; });
			return (!_.isUndefined(has));
		}
	});
	//define link relationship (Can't do it before QuestPage is initialized .. ):
	globals.QuestPage = QuestPage;
	return QuestPage;
	
});

