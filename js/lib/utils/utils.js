var utils = utils || {};
(function() {
	utils.precentToPixels = function(percent) {
		var h = $(window).height()*percent;
		var w = $(window).width()*percent;
		
		return {height: h, width: w};
	};
	
	utils.hexToRgb = function(hex) {
	    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	    return result ? {
	        r: parseInt(result[1], 16),
	        g: parseInt(result[2], 16),
	        b: parseInt(result[3], 16)
	    } : null;
	}
	
	utils.show_property_page = function(model) {
		var template_id = app.Attributes[model.get('page_type')].view.properties_template;
		var properties_prototype = app.Attributes[model.get('page_type')].view.properties_prototype;
		var prop_page = new properties_prototype({model:model, template:template_id});
		
		app.active_property_page = prop_page;
		
		prop_page.render();
	}
	
	utils.remove_property_page = function() {
		if ( app.active_property_page ){
			app.active_property_page.remove();
			app.active_property_page = undefined;
		}
	}
	
	utils.get_linkable_pages = function(parent_page) {
		return app.Pages.chain().filter( function(page) { return (page != parent_page && page.get('page_type') != 'surprise') } );
	}

}());