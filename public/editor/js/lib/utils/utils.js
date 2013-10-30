define([],function() {
	var utils = {};
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
	
	return utils;
});
