define(['views/QuestPagePropertiesView','views/EditableTableView','views/LinkEditableRowDialog','views/LinkEditableRowView',
        'models/Hint','models/LinkAnswer'],
        function(QuestPagePropertiesView,EditableTableView,LinkEditableRowDialog,LinkEditableRowView,Hint,LinkAnswer) {
	
	var QuestPageQuestionPropertiesView = QuestPagePropertiesView.extend({
		initialize: function(options) {
			this.constructor.__super__.initialize.apply(this, [options])
			_.bindAll(this.attach_myself);
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
			
			this.answers_section = new EditableTableView({
				model:this.model.get('answers'),
				templateName:'#tmpl_answers',
				row_templateName:'#tmpl_one_answer',
				binding:{
					'#lnk_edit_row':'answer_txt'
				},
				dialog_binding:{
					'#txt_answer': 'answer_txt',
				},
				dialog_template:'#tmpl_answer_dialog',
				dialog_class: LinkEditableRowDialog,
				row_class: LinkEditableRowView,
				model_prototype: LinkAnswer,
				model_prototype_options: {parent_page: this.model}
			});
		},
		
		render:function() {
			this.constructor.__super__.render.apply(this);
			this.$("#hint_place_holder").append(this.hint_section.render());
			this.$("#answers_place_holder").append(this.answers_section.render());
		},
	});
	
	return QuestPageQuestionPropertiesView;
})