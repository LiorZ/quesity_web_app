require.config({
  paths: {
    jQuery: '/js/lib/jquery/jquery.1.9.0',
    Underscore: '/js/lib/underscore/underscore',
    Backbone: '/js/lib/backbone/backbone',
    jQueryUI: '/js/lib/jquery-ui/jquery-ui-1.10.0.custom',
    JQueryUI_Maps: '/js/lib/jquery-ui/plugins/google-maps/jquery.ui.map.full.min',
    jQueryUI_easing: '/js/lib/jquery-ui/plugins/jquery-easing/jquery.easing.1.3',
    jQueryUI_tablesorter: '/js/lib/jquery-ui/plugins/tablesorter/jquery.tablesorter',
    EasingMenu: '/js/lib/behavior/EasingMenu',
    Joint: '/js/lib/jointjs/joint',
    Joint_dia:'/js/lib/jointjs/joint.dia',
    Joint_dia_org:'/js/lib/jointjs/joint.dia.org',
    Joint_dia_uml:'/js/lib/jointjs/joint.dia.uml',
    Raphael: '/js/lib/jointjs/raphael',
    json2: '/js/lib/jointjs/json2',
    tinymce: '/js/lib/tiny_mce/jquery.tinymce',
//    gmaps:'http://maps.google.com/maps/api/js?sensor=true&key=AIzaSyCI3y0xsOOIUye7jrp6HWjnOl1OTrCY4ls'
  },

  shim: {
      'Backbone': {
          deps: ['Underscore', 'jQuery'],
          exports: 'Backbone'
      },
      jQueryUI:['jQuery'],
      jQueryUI_Maps:['jQueryUI'],
//      gmaps: {
//    	  exports: 'google'
//      },
      jQueryUI_easing:['jQueryUI'],
      jQueryUI_tablesorter:['jQueryUI'],
      EasingMenu:['jQuery'],
      Joint:{
    	  deps:['Raphael','json2'],
    	  exports:'Joint'
      },
      Joint_dia: ['Joint'],
      Joint_dia_org: ['Joint_dia'],
      Joint_dia_uml: ['Joint_dia'],
      tinymce:['jQuery'],
    'views/appView': ['Backbone'],
    'models/Quest':['Backbone']
  }
});

require(['views/appView','models/Quest'],function(appView,Quest){
	$(document).ready(function() {
		var quest_model = new Quest();
		var app_view = new appView({model:quest_model});
	});
});