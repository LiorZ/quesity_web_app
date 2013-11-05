define(['Backbone','BackboneRelational','models/Quest','models/QuestCollection'],function(Backbone,BackboneRelational,Quest,QuestCollection) {
	var Account = Backbone.RelationalModel.extend({
		url:'/account/me',
		idAttribute: '_id',
		relations: [
			{
				type: Backbone.HasMany,
				key: 'quests',
				relatedModel: Quest,
				autoFetch: false,
				collectionType:QuestCollection,
				reverseRelation: {
					key: 'accountId',
					includeInJSON: 'id'
				}
			}
		]
	});
	return Account;
});