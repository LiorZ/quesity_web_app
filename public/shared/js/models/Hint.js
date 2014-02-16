define(['Backbone','BackboneRelational'],function(Backbone) {
	var Hint = Backbone.RelationalModel.extend({
		idAttribute: "_id",
		defaults: {
			hint_title:undefined,
			hint_txt:undefined,
			is_used: false
		},
		url:function() {
			var page_id = this.collection.parent.id;
			var quest_id = this.collection.parent.get('quest').id;
			var url = '';
			if (this.isNew()){
				url = "/quest/"+quest_id+ '/page/'+page_id+'/new_hint';
			}else { 
				url = "/quest/"+quest_id+ '/page/'+page_id+'/hint/'+this.get('_id');
			}
			return url;
		},
		
		initialize:function() {
			this.listenTo(this,'change',this.save_model);
		},
		save_model:function() {
			console.log("Saving Hint..");
			this.save(null,
					{
						error:function() {
							alert("Error: Could not save your diagram ");
						},
						silent:true
			});
		},
	});
	return Hint;
});
