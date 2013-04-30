define(['text!../../templates/home.html','models/Quest','jQueryUI'], function(home_template,Quest) {
	var HomeView = Backbone.View.extend({
		el:'#content',
		events: {
			'click #btn_new_quest': 'open_new_quest_dlg',
			'click button[name="btn_del_quest"]': 'delete_quest'
		},
		open_new_quest_dlg:function() {
			$('#dlg_create_quest').dialog('open');
		},
		render:function() {
			var tmpl = _.template(home_template);
			this.$el.append(tmpl(this.model.toJSON()));
			$('button').button();
			var context = this;
			$('#dlg_create_quest').dialog({
				autoOpen:false,
				title:'New Quest',
				modal:true,
				buttons:{
					OK: function() {
						var quest_title = $(this).find('#txt_quest_title').val();
						context.create_new_quest({title:quest_title});
					},
					Cancel: function() {
						$(this).dialog('close');
					}
				}
			})
		},
		create_new_quest:function(data) {
			var new_quest = new Quest({title:data.title});
			new_quest.save(null,{
				success: function() {
					window.location='/editor/' + new_quest.get('_id');
				},
				error: function() {
					alert("Could not create new quest. check your connection");
				}
			});
		},
		
		delete_quest:function(ev){
			var sure = confirm("Are you sure you want to delete this quest?");
			
			if ( !sure )
				return;
			
			
			var quest_id = $(ev.target).attr('data-quest-id');
			var quest = Quest.findOrCreate(quest_id,{create:false});
			if ( _.isNull(quest) || _.isUndefined(quest)) {
				alert("Can't delete quest!");
			}
			quest.destroy({
				success:function() {
					$(ev.target).parents('tr').remove();
				},
				error:function(err) {
					alert("Error deleting quest! " + err);
					console.log(err);
				},
				wait:true
			});
			$(ev.target).attr('disabled','disabled');
		}
	});
	
	return HomeView;
});