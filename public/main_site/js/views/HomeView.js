define(['text!../../templates/home.html','models/Quest'], function(home_template,Quest) {
	var HomeView = Backbone.View.extend({
		el:'#content',
		events: {
			'click #btn_new_quest': 'create_new_quest'
		},
		render:function() {
			var tmpl = _.template(home_template);
			this.$el.append(tmpl(this.model.toJSON()));
		},
		create_new_quest:function() {
			var new_quest = new Quest();
			new_quest.save();
		}
	});
	
	return HomeView;
});