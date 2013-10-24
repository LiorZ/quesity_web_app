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
									context.settings_view.render();
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
							$('button[name="btn_edit"]').button({text:false, icons: {primary: 'ui-icon-pencil'}});
							$('button[name="btn_del_quest"]').button({text:false,icons:{primary:'ui-icon-trash'}});
							$('#btn_profile_menu').menu();
							$('#btn_new_quest').button();
						},
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