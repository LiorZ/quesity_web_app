define(['jQueryUI','Backbone','routers/Router','views/ViewAttributes','models/ModelAttributes','views/QuestPageDiagramView','lib/utils/consts','views/MenuView', 'views/LinkView','Joint'
        ,'shared_views/QuestSettingsView'],
		function(jQueryUI,Backbone,EditorRouter,ViewAttributes,ModelAttributes,QuestPageDiagramView,consts,MenuView,LinkView,Joint,QuestSettingsView) {
	var eventagg = _.extend({}, Backbone.Events);
	var AppView = Backbone.View.extend({
		el: '#container',
		menu_view:undefined,
		active_property_page:undefined,
		page_count:0,
		pages:undefined,
		settings_view:undefined,
		paperObj:undefined,
		events: {
			'click li a': 'create_new_page',
			'click #world':'exit_property_page', //if a property page is open, a click outside of it exists the page
			'click #btn_new_page' : 'new_page_menu',
			'click #btn_exit_editor':'exit_editor',
			'click #btn_settings':'open_settings'
		},

		open_settings:function() {
			this.settings_view = new QuestSettingsView({model:this.model,should_open_editor:false});
			this.settings_view.render();
		},
		
		show_property_page:function(model) {
			var template_id = ViewAttributes[model.get('page_type')].view.properties_template;
			var properties_prototype = ViewAttributes[model.get('page_type')].view.properties_prototype;
			var prop_page = new properties_prototype({model:model, template:template_id});
			
			this.active_property_page = prop_page;
			prop_page.render();
		},
		new_page_menu:function(e) {
			 var menu = $("#new_page_menu");
			 menu.css('display','block');
			 menu.offset({left:$("#btn_new_page").offset().left});
		},
		remove_property_page:function() {
			if ( this.active_property_page ){
				this.active_property_page.save_page_contents();
				this.active_property_page.remove();
				this.active_property_page = undefined;
			}
		},
		exit_property_page:function() {
			if (this.active_property_page ){
				window.location.hash = "show_diagram";
			}
		},
		initialize: function() { 
			var pages = this.model.get('pages');
			this.listenTo(pages,'add',this.addQuestDiagramView);
			this.menu_view = new MenuView({pages: pages});
			this.init_router();
			this.paperObj = Joint.paper("world");

			$( "button" ).button();
		},
		init_router:function() {
			var Router = new EditorRouter();
			var context = this;
			var pages = this.model.get('pages');
			Router.on("route:go_to_page",function(page) {
				if ( page == undefined ) {
					return;
				}
				context.remove_property_page();
				if ( pages == undefined || pages.length == 0 ){
					return;
				}
				var page_model = pages.byPageNumber(page);
				if (page_model == undefined ){
					alert("ERROR: Can't find page!");
				}
				context.show_property_page(page_model);
			});
			
			Router.on("route:show_diagram", function() {
				context.remove_property_page();	
			});
		    Backbone.history.start();
		},
		
		addQuestDiagramView: function(page) {
			var view = new QuestPageDiagramView({model: page, eventagg: eventagg});
		},
		
		
		/*
		 * Returns a position for the new page , in the middle of the editor, takes into account translate and zoom..
		 */
		getPosForNewPage: function() {
			var newPos = {
					x: (this.paperObj.viewBoxWidth/2+this.paperObj.viewBox.X),
					y: (this.paperObj.viewBoxHeight/2+this.paperObj.viewBox.Y)
			};
			
			return newPos;
		},
		/*
		 * Renders the diagram upon startup
		 */
		render:function() {
			var pages = this.model.get('pages');
			if ( pages == undefined )
				return;
			var context = this;

			//first, render the pages. Then, render the connections between them.
			pages.each(function(page) {
				context.addQuestDiagramView(page);
			});
			
			pages.each(function(page) {
				var links = page.get('links');
				links.each(function(link){
					var link_view = new LinkView({model:link});
				});
			})
		},
		
		create_new_page: function(ev){
			var q_type = $(ev.target).data("page-type");
			var page_num = this.model.get('pages').get_next_page_num();
			
			//Get the location of next_page:
			var pages = this.model.get('pages');
			var error_callback = function() {
				alert("Could not add the page. Check your connection and try again")
			}
			var pos = this.getPosForNewPage();
			if ( pages.length > 0 ){
				var x_coord = pos.x;
				var y_coord = pos.y;
				pages.create({x:x_coord,y:y_coord,page_type:q_type,page_number:page_num},{wait:true,error:error_callback});
			}else {
				pages.create({page_type:q_type,page_number:page_num},{wait:true,error:error_callback});
			}
			 
			$("#new_page_menu").css('display','none');
		},
		exit_editor: function() {
			window.location ='/home';
		}
		
	});
	
	return AppView;
});