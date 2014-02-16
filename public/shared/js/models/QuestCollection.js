define(['Backbone','BackboneRelational','models/Quest'],function(Backbone,BackboneRelational,Quest) {
	var QuestCollection = Backbone.Collection.extend({
		url:'/account/quests',
		model:Quest
	});
	
	return QuestCollection;
});