define(['Backbone','BackboneRelational','models/Quest'],function(Backbone,BackboneRelational,Quest) {
	var Account = Backbone.RelationalModel.extend({
		url:'/account/me',
		relations: [
			{
				type: Backbone.HasMany,
				key: 'quests',
				relatedModel: Quest,
				autoFetch: false,
				reverseRelation: {
					key: 'accountId',
					includeInJSON: 'id'
				}
			}
		]
	});
	return Account;
});