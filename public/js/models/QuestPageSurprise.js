(function() {
	
	'use strict';


	app.QuestPageSurprise = app.QuestPage.extend({
		initialize:function(options) {
			this.constructor.__super__.initialize.apply(this, [options]);
			this.set('hints',new app.HintCollection());
			this.set('locations',new app.LinkLocationCollection());
			this.listenTo(this.get('locations'),'add',this.handle_add_link);
		},
		
	});
	_.extend(app.QuestPageSurprise.prototype.defaults, app.QuestPageLocation.prototype.defaults);

}());