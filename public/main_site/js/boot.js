//DEPRECATED!!!!

require.config({
  paths: {
    jQuery: '/shared/js/lib/jquery/jquery.1.9.0',
    jQueryUI: '/shared/js/lib/jquery-ui/jquery-ui-1.10.0.custom',
    Underscore: '/shared/js/lib/underscore/underscore',
    Backbone: '/shared/js/lib/backbone/backbone',
  },

  shim: {
    'Backbone': ['Underscore', 'jQuery'],
    'views/MainSite': ['Backbone'],
    jQueryUI: ['jQuery']
  }
});

require(['views/MainSite'], function(MainSite) {
	console.log("Initializing ...");
	MainSite.initialize();
});