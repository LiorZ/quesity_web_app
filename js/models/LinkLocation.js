(function() {
	
	'use strict';


	app.LinkLocation = app.Link.extend({
		
		defaults: {
			gps_coords:'',
			txt_street: '',
		}
	});
	
	_.extend(app.LinkLocation.prototype.defaults, app.Link.prototype.defaults);

	
	app.LinkLocationCollection = Backbone.Collection.extend({
		model: app.LinkLocation
	});
	
}());