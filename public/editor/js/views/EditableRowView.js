define([],function() {
	var EditableRowView = Backbone.View.extend({
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
			this.dialog_size = options.dialog_size;
			
		},
		refresh_data:function() { 
			if (this.binding){
				this.$el.html(this.template(this.model.toJSON({shallow:true})));
			}
			
		},
		
		render:function() {
			this.$el.html(this.template(this.model.toJSON({shallow:true})));
			return this.$el;
		},
		
		edit_row:function() {
			var edit_view = new this.dialog_class({model:this.model,
				binding:this.dialog_binding, 
				dialog_template: this.dialog_template,
				dialog_size: this.dialog_size,
				edit_mode: true
			});
			edit_view.render(false);
		},
		delete_row_view:function() {
			this.remove();
		},
		delete_row:function() {
			this.model.destroy();
		}
	});
	return EditableRowView;
});

