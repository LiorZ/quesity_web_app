define([],function() {
	var mixins = {
			one_child: {
				handle_add_link:function(new_link,collection) {
					new_link.set('parent_page',this);
					if ( collection.length > 1){
						var prev_page = collection.shift();
						prev_page.destroy();
					}
				}
			}
	};
	return mixins;
});
