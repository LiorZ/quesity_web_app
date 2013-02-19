(function() {
	
	'use strict';


	app.QuestPageStall = app.QuestPage.extend({
		initialize:function(options) {
			this.constructor.__super__.initialize.apply(this, [options]);
			this.set('links', new app.LinkCollection());
			this.listenTo(this.get('links'),'add',this.handle_add_link);
		},
		
		defaults:
		 {
			links: undefined,
			stall_time: undefined, //in seconds
		},
		
	});
	_.extend(app.QuestPageStall.prototype.defaults, app.QuestPage.prototype.defaults);
	_.extend(app.QuestPageStall.prototype, mixins.one_child); //enforce one child
}());
	