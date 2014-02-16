define(['models/globals','Backbone','BackboneRelational','models/Mixins'],function(globals,Backbone,BackboneRelational,Mixins) {
	var Link = Backbone.RelationalModel.extend({
		idAttribute: "_id",
		relations:[{
			type: Backbone.HasOne,
			key: 'links_to_page',
			relatedModel: 'QuestPage',
			includeInJSON: '_id',
			reverseRelation: {
				key: 'incoming_links',
				includeInJSON: false,
				type:Backbone.HasMany
			}
		}],
		subModelTypeAttribute:'type',
		subModelTypes:{
			'answer':'LinkAnswer',
			'location':'LinkLocation'
		},
		
		initialize:function() {
			this.listenTo(this,'change',this.save_model);
		},
		save_model:function() {
			console.log("Saving Link..");
			this.save(null,
					{
						error:function() {
							alert("Error: Could not save your diagram ");
						},
						silent:true
			});
		},
//		sync:function() {
//			return false;
//		},
		url:function() {
			var page_id = this.get('parent_page').id;
			var quest_id = this.get('parent_page').get('quest').id;
			var url = '';
			if (this.isNew()){
				url = "/quest/"+quest_id+ '/page/'+page_id+'/new_link';
			}else { 
				url = "/quest/"+quest_id+ '/page/'+page_id+'/link/'+this.get('_id');
			}
			return url;
		},
		defaults: {
			type:'regular',
			parent_page:undefined,
			links_to_page:undefined
		},
		get_label: function(property) {
			var label_length = 15;
			var txt = this.get(property);
			if ( txt === undefined )
				return '';
			
			if ( txt.length < label_length ){
				return txt;
			}
			return txt.slice(0,label_length) + '...';
		},
		get_link_view_properties_to_listen: function() {
			return undefined;
		}
	});
	_.extend(Link.prototype,Mixins.shallow_json);
	globals.Link = Link;
	return Link;
});

