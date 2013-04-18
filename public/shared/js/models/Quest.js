define(['models/QuestPageCollection'],function(QuestPageCollection) {
	var Quest = Backbone.Model.extend({
		initialize:function(options) {
			var pages = new QuestPageCollection();
			this.set('pages',pages);
			this.listenTo(pages,'add',this.add_self_reference);
		},
		add_self_reference:function(page) {
			page.set('quest',this);
		}
	});
	
	return Quest;
});