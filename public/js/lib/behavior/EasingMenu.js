(function( $ ){

	  $.fn.make_menu = function(options) {
		  var start_loc = options.start_loc;
		  var start_method = options.start_method;
		  var end_loc = options.end_loc;
		  var end_method = options.end_method;
		  var menu_fold_callback = options.menu_fold_callback;
		  var timer_in = undefined;
		  var time_out = undefined;
			$(this).mouseenter(function(e) {
				console.log(this);
				var elem = this;
				time_out = setTimeout(function() {$(elem).animate(start_loc, start_method ); }, 200);
				if ( timer_in )
					clearTimeout(timer_in);
			});
			var context = this;
			$(this).mouseleave(function(e) {
				if (time_out){
					clearTimeout(time_out);
					time_out = undefined;
				}
				
				timer_in = setTimeout(function() {
					menu_fold_callback();
					$(context).animate(end_loc, end_method); timer_in = undefined; 
				}, 800);
			});
	  };
	})( jQuery );
