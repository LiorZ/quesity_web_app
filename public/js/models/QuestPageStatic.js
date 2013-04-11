(function() {
	
	'use strict';


	app.QuestPageStatic = app.QuestPage.extend({
		initialize:function(options) {
			this.constructor.__super__.initialize.apply(this, [options]);
			this.set('links', new app.LinkCollection());
			this.listenTo(this.get('links'),'add',this.handle_add_link);
		},
		
		defaults:
		 {
			links: undefined
		},
		
	});
	_.extend(app.QuestPageStatic.prototype.defaults, app.QuestPage.prototype.defaults);
	_.extend(app.QuestPageStatic.prototype, mixins.one_child);
}());
	