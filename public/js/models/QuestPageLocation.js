(function() {
	
	'use strict';


	app.QuestPageLocation = app.QuestPage.extend({
		initialize:function(options) {
			this.constructor.__super__.initialize.apply(this, [options]);
			this.set('hints',new app.HintCollection());
			this.set('locations',new app.LinkLocationCollection());
		},
		defaults:
		 {
			locations: new app.LinkLocationCollection(),
			hints: new app.HintCollection()
		},
		
	});
	_.extend(app.QuestPageLocation.prototype.defaults, app.QuestPage.prototype.defaults);

}());