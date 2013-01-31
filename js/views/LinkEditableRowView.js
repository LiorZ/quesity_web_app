var app = app || {};
$(function() {
	
	app.LinkEditableRowView = app.EditableRowView.extend({
		tagName:'tr',
		template: undefined,
		
		events: _.extend({
			'click #lnk_page' : 'go_to_page',
	    }, app.EditableRowView.prototype.events),
	    
		initialize: function(options) {
			this.constructor.__super__.initialize.apply(this, [options]);
			
		},
		go_to_page:function() {
			
		}

		
	})}());