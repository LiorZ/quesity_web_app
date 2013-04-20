require.config({
  paths: {
    jQuery: '/shared/js/lib/jquery/jquery.1.9.0',
    Underscore: '/shared/js/lib/underscore/underscore',
    Backbone: '/shared/js/lib/backbone/backbone',
  },

  shim: {
    'Backbone': ['Underscore', 'jQuery'],
    'views/MainSite': ['Backbone']
  }
});

require(['views/MainSite'], function(MainSite) {
	console.log("Initializing ...");
	MainSite.initialize();
});