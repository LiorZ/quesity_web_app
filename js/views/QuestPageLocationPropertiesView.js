var app = app || {};
$(function() {
	
	app.QuestPageLocationPropertiesView = app.QuestPagePropertiesView.extend({
		initialize: function(options) {
			this.constructor.__super__.initialize.apply(this, [options])
			this.listenTo(this.model.get('locations'),'change',this.render);
			
			/*
			 * 			
			 * 
			 * this.templateName = options.templateName;
			
			this.row_templateName = options.row_templateName;
			this.binding = options.binding;
			this.dialog_binding = options.dialog_binding;
			this.dialog_html_id = options.dialog_html_id;
			
			this.model_prototype = options.model_prototype;
			 */
			
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
			this.$("#hint_place_holder").append(this.hint_section.render());
		},
	});
}());