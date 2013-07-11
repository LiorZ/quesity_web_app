define(['views/EditableRowDialog','views/LinkView','select2','views/ViewAttributes'],function(EditableRowDialog,LinkView,select2,ViewAttributes) {
	var LinkEditableRowDialog = EditableRowDialog.extend({
		initialize: function(options) {
			EditableRowDialog.prototype.initialize.apply(this, [options]);
		},

		save_object: function(dialog_obj,collection) {
			var page_number = this.$el.find("#next_page_link").val();
			var quest = {};
			if ( this.edit_mode ){
				quest = this.model.get('parent_page').get('quest');
			}
			else {
				var quest = this.model.parent.get('quest');
			}
			var page = quest.get('pages').byPageNumber(page_number);
			var success_callback = function(model) {
				var view = new LinkView({model: model});
				view.render();
			}
			EditableRowDialog.prototype.save_object.apply(this, [dialog_obj,{links_to_page:page, callback:success_callback}]);
		},
		
		render:function() {
			EditableRowDialog.prototype.render.apply(this, []);
			var page =this.model.parent;
			
			//With static pages this.model.parent == undefined for some reason .. 
			if ( page == undefined )
				page = this.model.get('parent_page');
			
			var context=this;
			this.$el.find('#next_page_link').select2({
				formatResult:function(quest_page){ return context.select_box_adapter(quest_page,page)},
	            formatSelection: function(quest_page){ return context.select_box_adapter(quest_page,page)},
	            escapeMarkup: function(m) { return m; }
			});
		},
		
		select_box_adapter:function(quest_page,page) {
			//Cyclic dep avoidence: 
			
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
		}
		
		
});
	return LinkEditableRowDialog;
});