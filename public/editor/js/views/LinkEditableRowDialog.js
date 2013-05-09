define(['views/EditableRowDialog','views/LinkView'],function(EditableRowDialog,LinkView) {
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
			var links_to_page = this.model.get('links_to_page');
//			if ( links_to_page == page ){
//				// in case we only change the label or something, this unset of the link will cause the old LinkView to be destroyed. Ugly, but for now it works.
//				this.model.set('links_to_page',undefined);
//			}
			
			var success_callback = function(model) {
				var view = new LinkView({model: model});
				view.render();
			}
			EditableRowDialog.prototype.save_object.apply(this, [dialog_obj,{links_to_page:page, callback:success_callback}]);
		}
		
});
	return LinkEditableRowDialog;
});