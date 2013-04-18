define(['views/EditableRowView','views/EditableRowDialog'],function(EditableRowView,EditableRowDialog){
	var EditableTableView = Backbone.View.extend({
		template: undefined,
		rows:[],
		events: {
			'click #btn_add_row': 'create_new_row',
		},
		initialize: function(options) {
			this.templateName = options.templateName;
			
			this.row_templateName = options.row_templateName;
			this.binding = options.binding;
			this.dialog_binding = options.dialog_binding;
			this.dialog_template = options.dialog_template;
			if ( options.row_class ) {
				this.row_class = options.row_class;
			}else { 
				this.row_class = EditableRowView;
			}
			
			if ( options.dialog_class ) {
				this.dialog_class = options.dialog_class;
			}else {
				this.dialog_class = EditableRowDialog;
			}
			
			if ( options.dialog_size ) {
				this.dialog_size = options.dialog_size;
			}else {
				this.dialog_size = {height:300, width:350};
			}
			this.template = _.template( $(this.templateName).html() );
			this.model_prototype = options.model_prototype;
			if ( options.model_prototype_options ) this.model_prototype_options = options.model_prototype_options;
			this.listenTo(this.model,'add',this.add_row);
			
		},
		add_row:function(row){
			var row_view = new this.row_class({
				model: row,
				templateName: this.row_templateName,
				binding: this.binding,
				dialog_binding: this.dialog_binding,
				dialog_template: this.dialog_template,
				dialog_class: this.dialog_class,
				dialog_size: this.dialog_size
			});
			this.rows.push(row_view);
			var element = row_view.render();
			this.$("#row_table_body").append(element);
		},
		
		remove_row:function(row) {
			if ( this.rows.length == 0 )
				return;
			for ( var i = 0; i<this.rows.length; i++ ) {
				if (this.rows[i].model == row) {
					this.rows[i].remove();
				}
			}
		},
		
		render:function() {
			this.$el.html(this.template({data:this.model.toJSON()}));
			var view = this;
			this.model.each(function(elem){
				view.add_row(elem);
			});
			return this.$el;
		},
		create_new_row:function() {
			var new_row;
			if (this.model_prototype_options)
				new_row = new this.model_prototype(this.model_prototype_options);
			else
				new_row = new this.model_prototype();
			this.add_row_dialog(new_row);
		},
		add_row_dialog: function(new_model) {
			var dialog = new this.dialog_class({
				model:new_model,
				binding: this.dialog_binding, 
				dialog_template:this.dialog_template, 
				dialog_class: this.dialog_class,
				dialog_size: this.dialog_size

			});
			dialog.render(this.model);
		}
	});
	
	return EditableTableView;
});
