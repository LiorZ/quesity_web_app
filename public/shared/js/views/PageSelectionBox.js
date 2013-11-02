define(['views/ViewAttributes','select2'],function(ViewAttributes,select2) {
	
	var PageSelectionBox = Backbone.View.extend({
		initialize: function(options) {
			this.el = options.el;
			this.style_function = options.style_function || function(){ };
		},
		
		render: function(selected_page) {
			var context =this;
			$(this.el).select2({
				formatResult:function(quest_page){ return context.select_box_adapter(quest_page,selected_page)},
	            formatSelection: function(quest_page){ return context.select_box_adapter(quest_page,selected_page)},
	            escapeMarkup: function(m) { return m; }
			});
		},
		
		
		select_box_adapter:function(quest_page,page) {
			
			ViewAttributes = require('views/ViewAttributes');
			var originalOption = quest_page.element;
			var type = $(originalOption).data('page-type');
			var page_id = $(originalOption).data('page-id');
			var connected = page.is_connected_to(page_id);
			var img_src = ViewAttributes[type].view.avatar;
			if ( img_src == undefined ){
				return quest_page.text;
			}
			var style ='';
			if ( connected ) {
				style = "style='font-weight:bold;'";
			}
			
			return "<image class='select_box_image' src="+img_src+"/> <span "+style+" >"+quest_page.text + "</span>"
		},
		
		get_page_number:function() {
			return this.$el.val();
		}
	});
	
	return PageSelectionBox;
});