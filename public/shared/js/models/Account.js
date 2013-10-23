define(['Backbone','BackboneRelational','models/Quest'],function(Backbone,BackboneRelational,Quest) {
	var Account = Backbone.RelationalModel.extend({
		url:'/account/me',
		idAttribute: '_id',
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