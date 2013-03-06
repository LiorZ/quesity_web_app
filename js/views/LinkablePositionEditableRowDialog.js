var app = app || {};
$(function() {
	
	app.LinkablePositionEditableRowDialog = app.LinkEditableRowDialog.extend({
		initialize: function(options) {
			app.LinkEditableRowDialog.prototype.initialize.apply(this, [options]);
		},
		
		render:function() {
			app.LinkEditableRowDialog.prototype.render.apply(this,[this.model.get('parent_page').get('locations') ]);
			var map_view = new app.MapView({model:this.model});
			this.$('#map_container').append(map_view.render());
			map_view.resize();
		},
		
	});
	
}());