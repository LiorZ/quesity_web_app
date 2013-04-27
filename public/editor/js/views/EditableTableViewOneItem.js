define(['views/EditableTableView'],function(EditableTableView){
	var EditableTableViewOneItem = EditableTableView.extend({
		events: {
			'click #btn_add_row': 'create_new_row',
		},
		create_new_row:function() {
			var edit_mode = this.model.length>0;
			var model = {};
			
			if ( edit_mode ) 
				model = this.model.at(0);
			else 
				model = this.model;
			
			var dialog = new this.dialog_class({
				model:model,
				binding: this.dialog_binding, 
				dialog_template:this.dialog_template, 
				model_prototype_options: this.model_prototype_options,
				dialog_class: this.dialog_class,
				dialog_size: this.dialog_size,
				edit_mode: edit_mode
			});
			dialog.render(this.model);
		}
	});
	return EditableTableViewOneItem;
});
