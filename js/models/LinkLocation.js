(function() {
	
	'use strict';


	app.LinkLocation = app.Link.extend({
		
		defaults: {
			lat:undefined,
			lng:undefined,
			txt_street: '',
			radius:100 //in meters
		},
	});
	
	_.extend(app.LinkLocation.prototype.defaults, app.Link.prototype.defaults);

	
	app.LinkLocationCollection = Backbone.Collection.extend({
		model: app.LinkLocation
	});
	
}());