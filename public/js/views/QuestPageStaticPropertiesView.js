define(['views/QuestPagePropertiesView','views/EditableTableView','views/LinkEditableRowDialog','views/LinkEditableRowView','models/Link'] , 
		function(QuestPagePropertiesView,EditableTableView,LinkEditableRowDialog,LinkEditableRowView,Link) {
	
	var QuestPageStaticPropertiesView = QuestPagePropertiesView.extend({
		initialize: function(options) {
			this.constructor.__super__.initialize.apply(this, [options])
			this.link_section = new EditableTableView({
				model:this.model.get('links'),
				templateName:'#tmpl_static_links',
				row_templateName:'#tmpl_one_link',
				dialog_template:'#tmpl_set_link_dialog',
				dialog_class: LinkEditableRowDialog,
				row_class: LinkEditableRowView,
				model_prototype: Link,
				model_prototype_options: {parent_page: this.model}
			});
			
		},
		
		render:function() {
			this.constructor.__super__.render.apply(this);
			this.$("#link_place_holder").append(this.link_section.render());
		},
	});
	
	return QuestPageStaticPropertiesView;
});