(function() {
	
	'use strict';


	app.QuestPageLocation = app.QuestPage.extend({
		
		defaults:
		 {
			locations: new app.LinkLocationCollection(),
			hints: new app.HintCollection()
		},
		
	});
	_.extend(app.QuestPageLocation.prototype.defaults, app.QuestPage.prototype.defaults);

}());