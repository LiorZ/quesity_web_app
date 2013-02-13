var app = app || {};
$(function() {
	
	app.LinkEditableRowDialog = app.EditableRowDialog.extend({
		initialize: function(options) {
			this.constructor.__super__.initialize.apply(this, [options]);
		},

		save_object: function(dialog_obj,collection) {
			var page_number = this.$el.find("#next_page_link").val();
			var page = app.Pages.byPageNumber(page_number);
			this.model.set("links_to_page",page);
			this.constructor.__super__.save_object.apply(this, [dialog_obj,collection]);
			
			var view = new app.LinkView({model: this.model});
			view.render();
			
			
		}
		
	})}());