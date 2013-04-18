define(['models/Link'],function(Link){
	var LinkCollection = Backbone.Collection.extend({
		model: Link,
	});
	
	return LinkCollection;
});