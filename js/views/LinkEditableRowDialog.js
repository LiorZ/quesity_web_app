var app = app || {};
$(function() {
	
	app.LinkEditableRowDialog = app.EditableRowDialog.extend({
		initialize: function(options) {
			app.EditableRowDialog.prototype.initialize.apply(this, [options]);
		},

		save_object: function(dialog_obj,collection) {
			var page_number = this.$el.find("#next_page_link").val();
			var page = app.Pages.byPageNumber(page_number);
			var is_links_to_page = this.model.get('links_to_page');
			
			this.model.set("links_to_page",page);
			app.EditableRowDialog.prototype.save_object.apply(this, [dialog_obj,collection]);
			
			//If link not set yet, create the view for the first time.
				var view = new app.LinkView({model: this.model});
				view.render();
			
		}
		
	})}());