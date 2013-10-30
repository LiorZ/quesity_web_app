define([],function() {
	var utils = {};
	utils.getPositionInScreen = function(obj) {
		var position = {}
		 var eTop = obj.offset().top; //get the offset top of the element
		  position.top = eTop - $(window).scrollTop(); //position of the ele w.r.t window

		  var eLeft = obj.offset().left;
		  position.left = eLeft - $(window).scrollLeft();
		  
		  return position;
	}
	return utils;
});
