define(['views/QuestPagePropertiesView','views/EditableTableView','models/Hint'],function(QuestPagePropertiesView,EditableTableView,Hint) {
	var QuestPageSurprisePropertiesView = QuestPagePropertiesView.extend({
		initialize: function(options) {
			this.constructor.__super__.initialize.apply(this, [options]);
			this.hint_section = new EditableTableView({
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
				model_prototype: Hint,
			});
		},
		render:function() {
			this.constructor.__super__.render.apply(this);
			this.$("#hint_place_holder").append(this.hint_section.render());
		},
	});
	
	return QuestPageSurprisePropertiesView;
});