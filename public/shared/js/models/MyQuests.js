define(['Backbone','BackboneRelational','models/Quest','models/globals'],function(Backbone,BackboneRelational,Quest,globals) {
	var MyQuests = Backbone.Collection.extend({
		url:'/my_quests',
		model:Quest,
	});
	
	globals.my_quests = new MyQuests();
	
	return MyQuests;
});