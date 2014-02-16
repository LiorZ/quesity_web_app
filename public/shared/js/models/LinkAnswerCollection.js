define(['models/LinkAnswer'],function(LinkAnswer) {
	var LinkAnswerCollection = Backbone.Collection.extend({
		model: LinkAnswer
	});
	
	return LinkAnswerCollection;
});