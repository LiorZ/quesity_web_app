define([], function() {
	var EditorRouter = Backbone.Router.extend({
		
		routes:{
			"page/:number":"go_to_page",
			"show_diagram":"show_diagram"
		},
		
	});
	
	return EditorRouter;
});
