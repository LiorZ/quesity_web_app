(function() {
	
	'use strict';


	app.LinkLocation = Backbone.Model.extend({
		
		defaults: {
			gps_coords:'',
			txt_street: '',
			links_to_page: undefined
		}
	});
	
	app.LinkLocationCollection = Backbone.Collection.extend({
		model: app.LinkLocation
	});
	
}());