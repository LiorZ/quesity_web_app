var app = app || {};
$(function() {
	
	app.EditableRowView = Backbone.View.extend({
		tagName:'tr',
		template: undefined,
		events: {
			'click #btn_delete_row':'delete_row',
			'click #lnk_edit_row':'edit_row'
		},
		initialize: function(options) {
			this.templateName = options.templateName;
			if ( options.binding )	this.binding = options.binding;
			if ( options.dialog_binding) this.dialog_binding = options.dialog_binding;
			this.dialog_template = options.dialog_template;
			this.template = _.template( $(this.templateName).html() );
			this.listenTo(this.model,'change',this.refresh_data);
			this.listenTo(this.model,'destroy',this.delete_row_view);
			this.dialog_class = options.dialog_class;
		},
		refresh_data:function() { 
			if (this.binding){
				for (var obj in this.binding) {
					this.$(obj).text(this.model.get(this.binding[obj]));
				}
			}
			
		},
		
		render:function() {
			this.$el.html(this.template(this.model.toJSON()));
			return this.$el;
		},
		
		edit_row:function() {
			var edit_view = new this.dialog_class({model:this.model, binding:this.dialog_binding, dialog_template: this.dialog_template});
			edit_view.render(false);
		},
		delete_row_view:function() {
			this.remove();
		},
		delete_row:function() {
			this.model.destroy();
		}
		
	})}());