/*
 * TODO:
 * 1) add tag auto-complete
 * 2) add model validation
 */

define(['models/Quest','Backbone','text!../../../templates/quest_settings_dialog.html','editor_views/MapView'],
		function(Quest,Backbone,quest_dialog_template) {
	var QuestSettingsView = Backbone.View.extend({
		events: {
			'click #btn_open_map':'open_map',
			'change #txt_radius':'change_radius',
			'spinstop #txt_radius':'change_radius'
		},
		id:'#dialog_container',
		change_radius:function() {
			var radius = this.$el.find('#txt_radius').val();
			console.log("Setting radius "+ radius);
			this.model.get('starting_location').set('radius',radius);
		},
		initialize: function(options) {
			this.title = '' || options.title;
			this.should_open_editor = options.should_open_editor;
			var tmpl = _.template(quest_dialog_template);
			this.$el.html(tmpl(this.model.toJSON()));
		},
		open_map:function() {
			var context = this;
			var map_view = new MapView({model:context.model.get('starting_location'), dialog_id:'#dlg_create_quest'});
			$('#map_container').append(map_view.render());
			$('#map_container').dialog({
				autoOpen : true,
				title:'Choose starting location',
				modal:true,
				width:550,
				draggable:true,
				close:function() {
					$('#map_container').html('');
					map_view.remove();
				},
				buttons:{ 
					OK: {
						text:"OK",
						click: function() {
							var starting_location = {
								street: context.$el.find('#txt_street').val(),
								radius: context.$el.find('#txt_radius').val(),
								lat:context.$el.find('#txt_lat').val(),
								lng:context.$el.find('#txt_lng').val()
							};
							context.model.set('starting_location',starting_location);
							$('#map_container').html('');
							map_view.remove();
							$(this).dialog('close');
						}
					},
				}
			});
			map_view.resize();

		},
		
		render:function(){
			this.$el.find('button').button();
			this.$el.find('button[name="btn_edit"]').button({ icons: {primary: 'ui-icon-pencil'}});
			this.$el.find('#tabs').tabs();
			this.$el.find('#tags').tagit();
			this.$el.find('#allowed_hints, #allowed_public_questions, #allowed_location_finders, #txt_radius').spinner();
			var context = this;
			var dialog_obj = this.$el.find('#dlg_create_quest');
			this.$el = this.$el.find('#dlg_create_quest').dialog(
					{
						autoOpen : true,
						title : context.title,
						width:800,
						height:650,
						modal : true,
						draggable:false,
						
						create: function() { // turn tabs into dialogs
							// define the elements we're dealing with
							$tabs = $(this).find('.ui-tabs-nav'); $dlg = $(this).parent();
							// clone close button from dialog title and put it in the tabs area
							$dlg.find('.ui-dialog-titlebar-close').appendTo($tabs);
							// make the tabs draggable, give it a class that gracefully adds the move cursor and remove the dialog's original titlebar completely
							$dlg.draggable({handle: ".ui-tabs-nav"})
								.addClass('ui-draggable')
								.find('.ui-dialog-titlebar').remove();
							// give dialog styles to the tabs (would like to do this without adding CSS, but couldn't)
				 			$dlg.find('.ui-tabs').css('padding', '0px');
							// turn off the highlighting of tabs in chrome, add titlebar style to tabs to give close button correct styling
							$tabs.addClass('ui-dialog-titlebar')
								.find('li, a').css('outline', 'none').mousedown(function(e){ e.stopPropagation(); });
							
						},
						close: function(){
							context.remove();
						},
						buttons : {
							Save :{
									id: 'create_quest_ok',
									text:'Save',
									click: function() {
										quest_data = {
												title: dialog_obj.find('#title').val(),
												description: dialog_obj.find('#description').val(),
												allowed_hints: dialog_obj.find('#allowed_hints').val(),
												allowed_public_questions: dialog_obj.find('#allowed_public_questions').val(),
												allowed_location_finders: dialog_obj.find('#allowed_location_finders').val(),
												starting_location: {
													street: dialog_obj.find('#txt_street').val(),
													radius: dialog_obj.find('#txt_radius').val(),
													lat:dialog_obj.find('#txt_lat').val(),
													lng:dialog_obj.find('#txt_lng').val()
												},
												tags:jQuery.makeArray(dialog_obj.find("#tags").tagit("assignedTags"))
										}
										context.model.set(quest_data);
										$(this).dialog('close');
										context.create_new_quest();
										
									}
							},
							Cancel : function() {
								$(this).dialog('close');
								context.remove();
							}
						}
					});
			this.delegateEvents(this.events);
		},
		
		create_new_quest : function() {
			var open_editor = this.should_open_editor;
			var context = this;
			this.model.save(
							null,
							{
								success : function() {
									if ( open_editor )
										window.location = '/editor/'+ context.model.id;
								},
								error : function() {
									alert("Could not create new quest. check your connection");
								}
							});
		},
	});
	
	return QuestSettingsView;
});