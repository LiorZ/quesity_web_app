define(['views/LinkEditableRowDialog','views/MapView'],function(LinkEditableRowDialog,MapView) {
	var LinkablePositionEditableRowDialog = LinkEditableRowDialog.extend({
		initialize: function(options) {
			LinkEditableRowDialog.prototype.initialize.apply(this, [options]);
		},
		
		render:function() {
			var links = {};
			if ( this.edit_mode ){
				links = this.model.get('parent_page').get('links');
			}else {
				links = this.model.parent.get('links');
			}
			LinkEditableRowDialog.prototype.render.apply(this,[links]);
			var map_view = new MapView({model:this.model});
			this.$('#map_container').append(map_view.render());
			map_view.resize();
		},
		
	});
	
	return LinkablePositionEditableRowDialog;
});

