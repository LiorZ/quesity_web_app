define(['Backbone','models/Link','BackboneRelational'],function(Backbone,Link,BackboneRelational) {

	var QuestPage = Backbone.RelationalModel.extend({
		idAttribute: "_id",

		relations: [{
			type: Backbone.HasMany,
			key: 'links',
			relatedModel: Link,
			reverseRelation: {
				key: 'parent_page',
				includeInJSON: '_id'
			}
		}],
		
		initialize: function(options) {
			this.attach_listeners();
		},
		attach_listeners:function() {
			this.listenTo(this,"change:x",this.save_model);
		},
		save_model:function() {
			this.save(null,{error:function() {
				alert("Error: Could not save your diagram ");
			}});
		},
		url:function() {
			if (this.isNew()){
				return "/quest/"+this.collection.quest.get('_id') + '/new_page';
			}else { 
				return "/quest/" + this.collection.quest.get('_id')+'/page/'+this.get('_id');
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
			) } );
		}
	});
		
	return QuestPage;
	
});

