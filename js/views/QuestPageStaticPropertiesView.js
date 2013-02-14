var app = app || {};
$(function() {
	
	app.QuestPageStaticPropertiesView = app.QuestPagePropertiesView.extend({
		initialize: function(options) {
			this.constructor.__super__.initialize.apply(this, [options])
			this.link_section = new app.EditableTableView({
				model:this.model.get('links'),
				templateName:'#tmpl_static_links',
				row_templateName:'#tmpl_one_link',
				dialog_template:'#tmpl_set_link_dialog',
				dialog_class: app.LinkEditableRowDialog,
				row_class: app.LinkEditableRowView,
				model_prototype: app.Link,
				model_prototype_options: {parent_page: this.model}
			});
			
		},
		
		render:function() {
			this.constructor.__super__.render.apply(this);
			this.$("#link_place_holder").append(this.link_section.render());
		},
	});
}());