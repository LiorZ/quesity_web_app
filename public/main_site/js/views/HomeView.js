define(
		[ 'text!../../../templates/home.html', 'models/Quest', 'jQueryUI','views/QuestSettingsView' ],
		function(home_template, Quest,jq,QuestSettingsView) {
			var HomeView = Backbone.View
					.extend({
						el : '#content',
						settings_view: undefined,
						events : {
							'click #btn_new_quest' : 'open_new_quest_dlg',
							'click button[name="btn_del_quest"]' : 'delete_quest',
							'mouseenter #btn_profile': 'display_profile_menu',
							'mouseleave #btn_profile_div': 'hide_profile_menu',
							'click #href_logoff': 'do_logoff',
							'click button[name="btn_edit"]':'edit_quest_details'
						},
						edit_quest_details: function(ev) {
							
							var quest_id =$(ev.target).parent('button').attr('data-quest-id') || $(ev.target).attr('data-quest-id');
							if ( _.isUndefined(quest_id) ){
								alert("Error opening quest editing dialog");
								return;
							}
							
							var quest_model = Quest.findOrCreate(quest_id,{create:false});
							var context = this;
							quest_model.fetch({
								success: function(model,response,options){
									context.settings_view = new QuestSettingsView({model:model, should_open_editor:false});
									context.$el.append(context.settings_view.render());
								}, 
								error: function(err) {
									alert("Error getting quest from server");
								}
							});
									 
//							//TODO: Shallow objects!!! (each request fetches an object)
//							var quest_id = $(ev.target).parent('button').attr(
//									'data-quest-id') || $(ev.target).attr('data-quest-id');
//							var quest_model = Quest.findOrCreate(quest_id,{create:false});
//							this.clear_form();
//							quest_model.fetch({success: function(model, response, options) {
//								$('#title').val(model.get('title'));
//								$('#txt_quest_id').val(model.id);
//								$('#description').val(model.get('description'));
//								$('#allowed_hints').val(model.get('allowed_hints'));
//								$('#allowed_public_questions').val(model.get('allowed_public_questions'));
//								$('#allowed_location_finders').val(model.get('allowed_location_finders'));
//								
//								$('#txt_street').val(model.get('starting_location').get('street'));
//								$('#txt_radius').val(model.get('starting_location').get('radius'));
//								$('#txt_lat').val(model.get('starting_location').get('lat'));
//								$('#txt_lng').val(model.get('starting_location').get('lng'));
//								$('#dlg_create_quest').dialog('open');
//							}, 
//							error: function() {
//								alert("Error loading quest details");
//							}});
							
						},
						do_logoff:function() {
							$.get('/logoff',function(data) {
								window.location = '/';
							}).fail(function(){alert("Error Logging out!")});
						},
						
						cancel_submission_on_enter:function(e) {
							return false;
						},
						
						display_profile_menu:function() {
							$('#btn_profile_menu').css('display','block');
						},
						hide_profile_menu:function() {
							$('#btn_profile_menu').css('display','none');
						},
						open_new_quest_dlg : function() {
							var new_quest_model = new Quest({accountId: this.model.id});
							if ( this.settings_view ) {
								this.settings_view.remove();
								this.settings_view = undefined;
							}
							this.settings_view = new QuestSettingsView({model:new_quest_model,should_open_editor:true});
							this.$el.append(this.settings_view.render());
						},
						render : function() {
							var tmpl = _.template(home_template);
							this.$el.append(tmpl(this.model.toJSON()));
							$('button').button();
							$('button[name="btn_edit"]').button({ icons: {primary: 'ui-icon-pencil'}});
							$('#btn_profile_menu').menu();
//							var context = this;
//							$('#tabs').tabs();
//							$('#tags').tagit();
//							$('#dlg_create_quest').dialog(
//									{
//										autoOpen : false,
//										title : 'New Quest',
//										width:800,
//										modal : true,
//										draggable:false,
//										
//										create: function() { // turn tabs into dialogs
//											// define the elements we're dealing with
//											$tabs = $(this).find('.ui-tabs-nav'); $dlg = $(this).parent();
//											// clone close button from dialog title and put it in the tabs area
//											$dlg.find('.ui-dialog-titlebar-close').appendTo($tabs);
//											// make the tabs draggable, give it a class that gracefully adds the move cursor and remove the dialog's original titlebar completely
//											$dlg.draggable({handle: ".ui-tabs-nav"})
//												.addClass('ui-draggable')
//												.find('.ui-dialog-titlebar').remove();
//											// give dialog styles to the tabs (would like to do this without adding CSS, but couldn't)
//								 			$dlg.find('.ui-tabs').css('padding', '0px');
//											// turn off the highlighting of tabs in chrome, add titlebar style to tabs to give close button correct styling
//											$tabs.addClass('ui-dialog-titlebar')
//												.find('li, a').css('outline', 'none').mousedown(function(e){ e.stopPropagation(); });
//											
//										},
//										
//										buttons : {
//											OK :{
//													id: 'create_quest_ok',
//													text:'OK',
//													click: function() {
//														
//														var quest_id = $('#txt_quest_id').val();
//														var new_quest;
//														if ( _.isUndefined(quest_id) || quest_id.length == 0 ) {
//															new_quest = new Quest();
//														}else {
//															new_quest = Quest.findOrCreate(quest_id,{create: false});
//														}
//														quest_data = {
//																title: $('#title').val(),
//																description: $('#description').val(),
//																allowed_hints: $('#allowed_hints').val(),
//																allowed_public_questions: $('#allowed_public_questions').val(),
//																allowed_location_finders: $('#allowed_location_finders').val(),
//																starting_location: {
//																	street: $('#txt_street').val(),
//																	radius: $('#txt_radius').val(),
//																	lat:$('#txt_lat').val(),
//																	lng:$('txt_lng').val()
//																},
//																tags:$("#tags").tagit("assignedTags").join(',')
//														}
//														new_quest.set(quest_data);
//														$(this).dialog('close');
//														context.create_new_quest(new_quest);
//														
//													}
//											},
//											Cancel : function() {
//												$(this).dialog('close');
//											}
//										}
//									});

							//Cancel the submission when pressing enter: 
//							$('#dlg_create_quest input').keypress(function(e){
//								if ( e.keyCode == $.ui.keyCode.ENTER ) {
//									return false;
//								}
//							})
						},
//						create_new_quest : function(new_quest) {
//							var open_editor = new_quest.isNew();
//							console.log(new_quest.toJSON());
//							new_quest
//									.save(
//											null,
//											{
//												success : function() {
////													if ( open_editor )
////														window.location = '/editor/'+ new_quest.get('_id');
//												},
//												error : function() {
//													alert("Could not create new quest. check your connection");
//												}
//											});
//						},

						delete_quest : function(ev) {
							var sure = confirm("Are you sure you want to delete this quest?");

							if (!sure)
								return;

							var quest_id = $(ev.target).parent('button').attr(
									'data-quest-id');
							var quest = Quest.findOrCreate(quest_id, {
								create : false
							});
							if (_.isNull(quest) || _.isUndefined(quest)) {
								alert("Can't delete quest!");
								return;
							}
							quest.destroy({
								success : function() {
									$(ev.target).parents('tr').remove();
								},
								error : function(err) {
									alert("Error deleting quest! " + err);
									console.log(err);
								},
								wait : true
							});
							$(ev.target).attr('disabled', 'disabled');
						}
					});

			return HomeView;
		});