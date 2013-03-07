(function() {
	
	'use strict';


	app.Link = Backbone.Model.extend({
		
		defaults: {
			links_to_page: undefined,
			parent_page: undefined,
		},
		get_label: function(property) {
			var txt = this.get(property);
			if ( txt == undefined )
				return '';
			
			if ( txt.length < consts.LABEL_LENGTH ){
				return txt;
			}
			return txt.slice(0,consts.LABEL_LENGTH) + '...';
		}
	});
	
	app.LinkCollection = Backbone.Collection.extend({
		model: app.Link,
	});
	
}());