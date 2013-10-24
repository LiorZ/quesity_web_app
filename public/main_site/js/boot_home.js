require.config({
  paths: {
    jQuery: '/shared/js/lib/jquery/jquery.1.9.0',
    Underscore: '/shared/js/lib/underscore/underscore',
    BackboneLocal: '/shared/js/lib/backbone/backbone.local.attrs',
    Backbone: '/shared/js/lib/backbone/backbone',
    models:'/shared/js/models/',
    views:'/main_site/js/views/',
    BackboneRelational: '/shared/js/lib/backbone/backbone-relational',
    jQueryUI: '/shared/js/lib/jquery-ui/jquery-ui-1.10.0.custom',
    tagit: '/shared/js/lib/jquery-ui/plugins/tagit/tag-it',
    ADGallery:'/shared/js/lib/jquery-ui/plugins/ADGallery/jquery.ad-gallery',
    editor_views:'/editor/js/views/',
    shared_views:'/shared/js/views/',
    shared_templates:'/shared/templates',
    JQueryUI_Maps: '/shared/js/lib/jquery-ui/plugins/google-maps/jquery.ui.map.full.min',
  },

  shim: {
	'Underscore': {
		deps:['jQuery'],
		exports:'_'
	},
	jQueryUI: {
		deps:['jQuery'],
		exports:'jQueryUI'
	},
	JQueryUI_Maps:['jQueryUI'],
    'Backbone': {
    	deps: ['Underscore', 'jQuery'],
    	exports:'Backbone'
    } ,
    'BackboneRelational':{
    	deps:['Backbone'],
    	exports: 'BackboneRelational'
    },
    'BackboneLocal': {
  	  deps:['Backbone'],
  	  exports: 'BackboneLocal'
    },
    ADGallery:{
    	deps:['jQueryUI']
    },
    tagit: {
    	deps:['jQueryUI'],
    	exports:'tagit'
    },
    'views/HomeView': ['Backbone'],
    'models/Account':['Backbone'],
  }
});

require(['views/HomeView','models/Account','tagit','ADGallery'], function(HomeView,Account) {
	console.log("Initializing ...");
	var new_account = new Account();
	new_account.fetch({success:function() {
		var home_view = new HomeView({model:new_account});
		home_view.render();
	}});
});