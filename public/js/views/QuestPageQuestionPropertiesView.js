var app = app || {};
$(function() {
	
	app.QuestPageQuestionPropertiesView = app.QuestPagePropertiesView.extend({
		initialize: function(options) {
			this.constructor.__super__.initialize.apply(this, [options])
			_.bindAll(this.attach_myself);
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
				model_prototype: app.Hint,
			});
			
			this.answers_section = new app.EditableTableView({
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
				dialog_class: app.LinkEditableRowDialog,
				row_class: app.LinkEditableRowView,
				model_prototype: app.LinkAnswer,
				model_prototype_options: {parent_page: this.model}
			});
		},
		
		render:function() {
			this.constructor.__super__.render.apply(this);
			this.$("#hint_place_holder").append(this.hint_section.render());
			this.$("#answers_place_holder").append(this.answers_section.render());
		},
	});
}());