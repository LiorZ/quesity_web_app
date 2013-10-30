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
	
	utils.getPositionInScreen(obj) {
		var position = {}
		 var eTop = obj.offset().top; //get the offset top of the element
		  position.top = eTop - $(window).scrollTop(); //position of the ele w.r.t window

		  var eLeft = obj.offset().left;
		  position.left = eLeft - $(window).scrollLeft();
		  
		  return position
	}
	return utils;
});
