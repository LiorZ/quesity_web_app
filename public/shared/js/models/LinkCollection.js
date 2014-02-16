define(['models/Link'],function(Link){
	var LinkCollection = Backbone.Collection.extend({
		model: Link,
		initialize:function() {
			this.listenTo(this,'add',this.handle_add);
			this.listenTo(this,'remove',this.handle_remove);
		},
	
		handle_add:function(model, collection, options) {
			var self = this;
			//intended for reorganizing the linkviews
			this.listenTo(model,'change:links_to_page',function(model, options) {
				self.trigger('change:links_to_page',model);
			});
		},
		handle_remove: function(model, collection, options) {
			this.stopListening(model);
		},
	});
	
	return LinkCollection;
});