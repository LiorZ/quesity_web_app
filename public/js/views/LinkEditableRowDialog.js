var app = app || {};
$(function() {
	
	app.LinkEditableRowDialog = app.EditableRowDialog.extend({
		initialize: function(options) {
			app.EditableRowDialog.prototype.initialize.apply(this, [options]);
		},

		save_object: function(dialog_obj,collection) {
			var page_number = this.$el.find("#next_page_link").val();
			var page = app.Pages.byPageNumber(page_number);
			var links_to_page = this.model.get('links_to_page');
			if ( links_to_page == page ){
				// in case we only change the label or something, this unset of the link will cause the old LinkView to be destroyed. Ugly, but for now it works.
				this.model.set('links_to_page',undefined);
			}
			this.model.set("links_to_page",page);
			app.EditableRowDialog.prototype.save_object.apply(this, [dialog_obj,collection]);
			
			var view = new app.LinkView({model: this.model});
			view.render();
			
		}
		
	})}());