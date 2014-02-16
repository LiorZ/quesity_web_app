define(['Backbone','BackboneRelational','models/Game'],function(Backbone,BackboneRelational,Game) {
	var GameCollection = Backbone.Collection.extend({
		model:Game,
		local:true,
		url: function() {
			return "/games";
		},
		initialize:function() {
			this.listenTo(this,'add',this.add_listeners);
		},
		add_listeners:function(model) {
			var context = this;
			this.listenTo(model,"change:current_page",function() {
				context.trigger_page_change(model);
			});
			this.listenTo(model,"game:end", function() {
				this.remove(model);
			});
		},
		trigger_page_change:function(model) {
			this.trigger("change:game:page",model);
		}
	});
	
	return GameCollection;
});