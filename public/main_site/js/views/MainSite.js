//DEPRECATED!!

define(['router'], function(router) {
	var initialize = function() { 
		checkLogin(runApplication);
	}
	
	var checkLogin = function(callback) { 
		$.ajax("/account/me", {
			method: "GET",
			success: function() {
				return callback(true);
			},
		
			error: function(data) {
				return callback(false);
			}
		});
	};
	
	var runApplication = function(authenticated) { 
		if ( !authenticated ) {
			window.location.hash = 'login';
		}else {
			window.location = '/home';
		}
		Backbone.history.start();
	};
	
	return {
		initialize: initialize
	};
});