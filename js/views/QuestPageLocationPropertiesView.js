var app = app || {};
$(function() {
	
	app.QuestPageLocationPropertiesView = app.QuestPagePropertiesView.extend({
		initialize: function(options) {
			this.constructor.__super__.initialize.apply(this, [options])
			this.location_section = new app.EditableTableView({
				model:this.model.get('locations'),
				templateName:'#tmpl_locations',
				row_templateName:'#tmpl_one_location',
				binding:{
					'#lnk_edit_row':'txt_street',
					'#lbl_radius':'radius'
				},
				dialog_binding: {
					'#txt_lat':'lat',
					'#txt_lng':'lng',
					'#txt_radius':'radius',
					'#txt_street':'txt_street'
				},
				dialog_template:'#tmpl_add_location_dialog',
				dialog_class: app.LinkablePositionEditableRowDialog,
				dialog_size: {height: '800', width:'600' },
				row_class: app.LinkEditableRowView,
				model_prototype: app.LinkLocation,
				model_prototype_options: {parent_page: this.model}
			});
			
			this.hint_section = new app.EditableTableView({
				model:this.model.get('hints'),
				templateName:'#tmpl_hints',
				row_templateName:'#tmpl_one_hint',
				binding:{
					'#lnk_edit_row':'hint_title'
				},
				dialog_binding:{
					'#txt_hint_title': 'hint_title',
					'#txt_hint': 'hint_txt'
				},
				dialog_template:'#tmpl_hint_dialog',
				model_prototype: app.Hint
			});
		},
		
		render:function() {
			this.constructor.__super__.render.apply(this);
			this.$("#locations_place_holder").append(this.location_section.render());
			this.$("#hint_place_holder").append(this.hint_section.render());

		},
	});
}());