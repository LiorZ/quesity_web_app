define(['models/Hint'],function(Hint){

	var HintCollection = Backbone.Collection.extend({
			model: Hint
	});
	
	return HintCollection;
});
