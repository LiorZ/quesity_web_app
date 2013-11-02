define(['shared_views/ViewAttributes','select2'],function(ViewAttributes,select2) {
	
	var PageSelectionBox = Backbone.View.extend({
		events:{
			'change':'my_change_listener',
		},
		initialize: function(options) {
			this.$el = $(options.el);
			this.change_listener = options.change_listener || function(ev) {console.log(ev)};
		},
		
		get_selected_page_id: function(ev) {
			var selected_option = $(ev.target).find(':selected');
			var selected_page_id = selected_option.attr('data-page-id');
			return selected_page_id;
		},
		my_change_listener:function(ev) {
			var selected_page_id  = this.get_selected_page_id(ev);
			this.change_listener(selected_page_id);
		},
		
		
		render: function(selected_page) {
			var context =this;
			this.$el.select2({
				formatResult:function(quest_page){ return context.select_box_adapter(quest_page,selected_page)},
	            formatSelection: function(quest_page){ return context.select_box_adapter(quest_page,selected_page)},
	            escapeMarkup: function(m) { return m; }
			});
			this.delegateEvents(this.events);

		},
		
		
		select_box_adapter:function(quest_page,page) {
			
			var originalOption = quest_page.element;
			var type = $(originalOption).data('page-type');
			var page_id = $(originalOption).data('page-id');
			var connected = false;
			if ( !_.isUndefined(page) ) {
				connected = page.is_connected_to(page_id);
			}
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