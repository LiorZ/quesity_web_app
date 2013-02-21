var app = app || {};
$(function() {
	
	app.QuestPageStallPropertiesView = app.QuestPagePropertiesView.extend({
		events: {
			'click #btn_set_time':'open_set_time_dlg'
		},
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
			
			this.listenTo(this.model,"change:stall_time",this.add_time_delay_label);
			
		},
		
		render:function() {
			this.constructor.__super__.render.apply(this);
			this.$("#link_place_holder").append(this.link_section.render());
			this.add_time_delay_label();
		},
		
		add_time_delay_label:function() {
			var tmpl = _.template( $('#tmpl_time_label').html() );
			$("#time_delay").html(tmpl(this.model.toJSON()));
		},
		
		open_set_time_dlg: function() {
			var dlg = new app.EditableRowDialog({dialog_template: '#tmpl_set_time_dialog',model: this.model,
			binding: {'#time_delay_spinner':'stall_time'}});
			dlg.render();
			$("#time_delay_spinner").spinner();
		}
	});
	
	_.extend(app.QuestPageStallPropertiesView.prototype.events,app.QuestPagePropertiesView.prototype.events);
}());