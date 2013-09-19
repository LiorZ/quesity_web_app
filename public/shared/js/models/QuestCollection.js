define(['Backbone','BackboneRelational'],function(Backbone,BackboneRelational) {
	var QuestCollection = Backbone.Collection.extend({
		url:'/account/quests'
	});
	
	return QuestCollection;
});