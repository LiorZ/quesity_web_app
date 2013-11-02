define(['views/EditableRowDialog','views/LinkView','shared_views/PageSelectionBox'],function(EditableRowDialog,LinkView,PageSelectionBox) {
	var LinkEditableRowDialog = EditableRowDialog.extend({
		initialize: function(options) {
			EditableRowDialog.prototype.initialize.apply(this, [options]);
			this.page_selection_box = new PageSelectionBox({el:'#next_page_link'});
		},

		save_object: function(dialog_obj,collection) {
			var page_number = this.page_selection_box.get_page_number();
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
			this.page_selection_box.render(page);
		},
		
		
});
	return LinkEditableRowDialog;
});