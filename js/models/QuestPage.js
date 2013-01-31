(function() {
	
	'use strict';


	app.QuestPage = Backbone.Model.extend({
		initialize: function(options) {
			
		},
		defaults: {
			x:220,
			y:220,
			page_name:"Untitled",
			page_type: "",
			page_number: 1,
			jointObj: undefined,
		}
	});
	
}());