(function() {
	
	'use strict';


	app.Link = Backbone.Model.extend({
		
		defaults: {
			links_to_page: undefined,
			parent_page: undefined,
		},
		get_label: function() {
			return undefined;
		}
	});
	
	app.LinkCollection = Backbone.Collection.extend({
		model: app.Link,
	});
	
}());