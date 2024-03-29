require.config({
  paths: {
	models:'/shared/js/models',  
    jQuery: '/shared/js/lib/jquery/jquery.1.9.0',
    Underscore: '/shared/js/lib/underscore/underscore',
    Backbone: '/shared/js/lib/backbone/backbone',
    BackboneLocal: '/shared/js/lib/backbone/backbone-relational',
    BackboneRelational: '/shared/js/lib/backbone/backbone-relational',
    jQueryUI: '/shared/js/lib/jquery-ui/jquery-ui-1.10.0.custom',
    JQueryUI_Maps: '/shared/js/lib/jquery-ui/plugins/google-maps/jquery.ui.map.full.min',
    jQueryUI_easing: '/shared/js/lib/jquery-ui/plugins/jquery-easing/jquery.easing.1.3',
    jQueryUI_tablesorter: '/shared/js/lib/jquery-ui/plugins/tablesorter/jquery.tablesorter',
    tagit: '/shared/js/lib/jquery-ui/plugins/tagit/tag-it',
    EasingMenu: '/editor/js/lib/behavior/EasingMenu',
    Joint: '/editor/js/lib/jointjs/joint',
    Joint_dia:'/editor/js/lib/jointjs/joint.dia',
    Joint_dia_org:'/editor/js/lib/jointjs/joint.dia.org',
    Joint_dia_uml:'/editor/js/lib/jointjs/joint.dia.uml',
    Raphael: '/editor/js/lib/jointjs/raphael',
    json2: '/editor/js/lib/jointjs/json2',
    tinymce: '/editor/js/lib/tiny_mce/jquery.tinymce',
    text: '/shared/js/lib/text/text',
    select2:'/shared/js/lib/jquery-ui/plugins/select2/select2',
    shared_templates:'/shared/templates/',
    shared_views:'/shared/js/views/',
    ADGallery:'/shared/js/lib/jquery-ui/plugins/ADGallery/jquery.ad-gallery',
    async: '/shared/js/lib/async/async',
    config:'/shared/js/config'
  },

  shim: {
	  'jQuery':{
		  exports:'jQuery'
	  },
	  'Underscore':{
		  deps: ['jQuery'],
		  exports: "_"
	  },
      'Backbone': {
          deps: ['Underscore', 'jQuery'],
          exports: 'Backbone'
      },
      'BackboneRelational' : {
    	deps:['Backbone'],
    	exports: 'BackboneRelational'
      },
      jQueryUI:['jQuery'],
      jQueryUI_Maps:['jQueryUI'],
      jQueryUI_easing:['jQueryUI'],
      jQueryUI_tablesorter:['jQueryUI'],
      EasingMenu:['jQuery'],
      select2:['jQueryUI'],
      Joint:{
    	  deps:['Raphael','json2'],
    	  exports:'Joint'
      },
      tagit: {
      	deps:['jQueryUI'],
      	exports:'tagit'
      },
      ADGallery:{
      	deps:['jQueryUI']
      },
      Joint_dia: ['Joint'],
      Joint_dia_org: ['Joint_dia'],
      Joint_dia_uml: ['Joint_dia'],
      tinymce:['jQuery'],
    'views/appView': ['Backbone'],
    'models/Quest':['Backbone'],
  }
});

require(['async','views/appView','models/Quest','text!../templates/all.html','Backbone','BackboneRelational','models/globals','tagit','ADGallery'],
		function(async,appView,Quest,templates,Backbone,BackboneRelational,globals){
	
	Backbone.Relational.store.addModelScope(globals);
	
	$(document).ready(function() {
		$('body').append(templates);
		var quest_id = $('#quest_id').val();
		
		var quest_model = new Quest({_id:quest_id});
		quest_model.fetch({
			success: function(){
				quest_model.get('pages').fetch({async:false});
				var app_view = new appView({model:quest_model});
				app_view.render();
			},
			error: function(err){
				alert("Can't load quest!");
				console.log(err);
			}
		});
		
	});
});