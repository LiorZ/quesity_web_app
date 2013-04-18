define(['views/EditableRowView'],function(EditableRowView) {
	LinkEditableRowView = EditableRowView.extend({
		tagName:'tr',
		template: undefined,
		
		events: _.extend({
			'click #lnk_links_to_page' : 'go_to_page',
	    }, EditableRowView.prototype.events),
	    
		initialize: function(options) {
			this.constructor.__super__.initialize.apply(this, [options]);
			
		},
		go_to_page:function() {
			var page_number = this.model.get('links_to_page').get("page_number");
			window.location.hash = "page/"+page_number;
		}
	});
	
	return LinkEditableRowView;
});
