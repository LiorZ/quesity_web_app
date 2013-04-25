define(['views/EditableRowDialog','views/LinkView'],function(EditableRowDialog,LinkView) {
	var LinkEditableRowDialog = EditableRowDialog.extend({
		initialize: function(options) {
			EditableRowDialog.prototype.initialize.apply(this, [options]);
		},

		save_object: function(dialog_obj,collection) {
			var page_number = this.$el.find("#next_page_link").val();
			var quest = this.model.get('parent_page').get('quest');
			var page = quest.get('pages').byPageNumber(page_number);
			var links_to_page = this.model.get('links_to_page');
			if ( links_to_page == page ){
				// in case we only change the label or something, this unset of the link will cause the old LinkView to be destroyed. Ugly, but for now it works.
				this.model.set('links_to_page',undefined);
			}
			EditableRowDialog.prototype.save_object.apply(this, [dialog_obj,collection]);
			this.model.set("links_to_page",page);

			var view = new LinkView({model: this.model});
			view.render();
			
		}
		
});
	return LinkEditableRowDialog;
});