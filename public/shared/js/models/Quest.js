define(['models/QuestPageCollection'],function(QuestPageCollection) {
	var Quest = Backbone.Model.extend({
		defaults:{
			title:'Untitled Quest'
		},
		idAttribute: "_id",
		initialize:function(options) {
			var pages = new QuestPageCollection();
			this.set('pages',pages);
			this.listenTo(pages,'add',this.add_self_reference);
		},
		url:function() {
			if (this.isNew()){
				return '/new_quest';
			}else {
				return '/quest/'+this.get('_id');
			}
		},
		add_self_reference:function(page) {
			page.set('quest',this);
		}
	});
	
	return Quest;
});