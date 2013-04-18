require.config({
  paths: {
    jQuery: '/js/lib/jquery/jquery.1.9.0',
    Underscore: '/js/lib/underscore/underscore',
    Backbone: '/js/lib/backbone/backbone',
  },

  shim: {
    'Backbone': ['Underscore', 'jQuery'],
    'views/MainSite': ['Backbone']
  }
});

require(['views/MainSite'], function(HomeView) {
	console.log("Initializing ...");
	MainSite.initialize();
});