define(['models/LinkLocation'],function(LinkLocation){
	var LinkLocationCollection = Backbone.Collection.extend({
		model: LinkLocation,
	});	
	
	return LinkLocationCollection;
});
