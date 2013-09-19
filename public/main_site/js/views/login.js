//DEPRECATED!

define(['text!../../templates/login.html'], function(loginTemplate) {
  var loginView = Backbone.View.extend({
    el: $('#content'),
    events: { 
    	'submit form':'login_action'
    },
    render: function() {
      this.$el.html(loginTemplate);
  	$('input[type="submit"]').button();

    },
    
    login_action:function() { 
		var username = $('input[name=email]').val();
		var password = $('input[name=password]').val();
		console.log("Trying to login with " + username + " and " + password);
		$.post('/login',{ email: username, password: password } ,function(data) {
			console.log(data);
			window.location.href = '/home'; } )
			.error(function(){alert("Error logging in!")});    
		return false;	
    }
  });

  return loginView;
});