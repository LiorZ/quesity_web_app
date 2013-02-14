(function() {
	
	'use strict';
	app.GeneralRouter = Backbone.Router.extend({
		
		routes:{
			"page/:number":"go_to_page",
			"show_diagram":"show_diagram"
		},
		
	});
	app.Router = new app.GeneralRouter();
	app.Router.on("route:go_to_page",function(page) {
		if ( page == undefined ) {
			return;
		}
		utils.remove_property_page();
		if ( app.Pages == undefined || app.Pages.length == 0 ){
			return;
		}
		var page_model = app.Pages.byPageNumber(page);
		if (page_model == undefined ){
			alert("ERROR: Can't find page!");
		}
		utils.show_property_page(page_model);
	});
	
	app.Router.on("route:show_diagram", function() {
		utils.remove_property_page();	
	});
	
    Backbone.history.start();
    
}());