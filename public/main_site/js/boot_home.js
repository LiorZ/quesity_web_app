require.config({
  paths: {
    jQuery: '/shared/js/lib/jquery/jquery.1.9.0',
    Underscore: '/shared/js/lib/underscore/underscore',
    BackboneLocal: '/shared/js/lib/backbone/backbone.local.attrs',
    Backbone: '/shared/js/lib/backbone/backbone',
    models:'/shared/js/models/'
  },

  shim: {
    'Backbone': {
    	deps: ['Underscore', 'jQuery'],
    	exports:'Backbone'
    } ,
    'BackboneLocal': {
  	  deps:['Backbone'],
  	  exports: 'BackboneLocal'
    },
    'views/HomeView': ['Backbone'],
    'models/Account':['Backbone'],
  }
});

require(['views/HomeView','models/Account'], function(HomeView,Account) {
	console.log("Initializing ...");
	var new_account = new Account();
	new_account.fetch({success:function() {
		var home_view = new HomeView({model:new_account});
		home_view.render();
	}});
});