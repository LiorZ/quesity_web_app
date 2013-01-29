var utils = utils || {};
(function() {
	utils.precentToPixels = function(percent) {
		var h = $(window).height()*percent;
		var w = $(window).width()*percent;
		
		return {height: h, width: w};
	}
}());