var mixins = mixins || {};
(function() {
	app.ParentAdder =
		
	{
			add_parent: function(parent) {
					this.set('parent_page',parent);
			}
	};
	
	
	mixins.one_child = {
		handle_add_link:function(new_link,collection) {
			new_link.set('parent_page',this);
			if ( collection.length > 1){
				var prev_page = collection.shift();
				prev_page.destroy();
			}
		}
	}
}());