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
		
		handle_add_link:function(new_link) {
			new_link.set('parent_page',this);
			if ( this.get('links').length > 1){
				var prev_page = this.get('links').shift();
				prev_page.destroy();
			}
		}
		
	});
	_.extend(app.QuestPageStatic.prototype.defaults, app.QuestPage.prototype.defaults);
//	_.extend(app.QuestPageQuestion.prototype.defaults, app.ParentAdder);
}());
	