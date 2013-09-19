//DEPRECATED

define(['text!../../templates/register.html'], function(registerTemplate) {
  var registerView = Backbone.View.extend({
	el: $('#content'),
	events: { 
	"submit form":"register"
	},
	render: function() {
		this.$el.html(registerTemplate);
	},
	
	register:function() {
		var first_name = $('input[name=firstName]').val();
		var last_name = $('input[name=lastName]').val();
		var email = $('input[name=email]').val();
		var password = $('input[name=password]').val();
		console.log(first_name);
		$.post('/register', {
				firstName: first_name,
				lastName: last_name,
				email: email,
				password: password
			},
			function(data) {
				console.log(data);
				window.location = '/home'
			});
		return false;
	}
  });

  return registerView;
});