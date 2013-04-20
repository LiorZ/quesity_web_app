define(['Backbone'],function(Backbone) {
	var Account = Backbone.Model.extend({
		url:'/account/me',
	});
	return Account;
});