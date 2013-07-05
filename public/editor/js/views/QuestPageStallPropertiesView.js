define(['views/QuestPagePropertiesView','views/EditableRowDialog','views/EditableTableViewOneItem','views/LinkEditableRowDialog','views/LinkEditableRowView',
        'models/Link'],function(QuestPagePropertiesView,EditableRowDialog,EditableTableViewOneItem,LinkEditableRowDialog,LinkEditableRowView,Link) {
	var QuestPageStallPropertiesView = QuestPagePropertiesView.extend({
		events: {
			'click #btn_set_time':'open_set_time_dlg'
		},
		initialize: function(options) {
			this.constructor.__super__.initialize.apply(this, [options])
			this.link_section = new EditableTableViewOneItem({
				model:this.model.get('links'),
				templateName:'#tmpl_static_links',
				row_templateName:'#tmpl_one_link',
				dialog_template:'#tmpl_set_link_dialog',
				dialog_class: LinkEditableRowDialog,
				row_class: LinkEditableRowView,
				model_prototype: Link,
				binding:{}, //So that the table will get updated .. 
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
			this.model.save_model();
		},
		
		open_set_time_dlg: function() {
			var dlg = new EditableRowDialog({
				dialog_template: '#tmpl_set_time_dialog',
				model: this.model,
				binding: {'#time_delay_spinner':'stall_time'},
				dialog_size:{height:300, width:350},
				edit_mode: true
			});
			dlg.render();
			$("#time_delay_spinner").spinner({
				min:0
			});
		}
	});
	
	_.extend(QuestPageStallPropertiesView.prototype.events,QuestPagePropertiesView.prototype.events);
	
	return QuestPageStallPropertiesView;
});