var app = app || {};
$(function( $ ) {
	
	app.eventagg = _.extend({}, Backbone.Events);
	
	app.AppView = Backbone.View.extend({
		el: '#container',
		menu_view:undefined,
		events: {
			'click li a': 'create_new_page',
			'click #world':'exit_property_page' //if a property page is open, a click outside of it exists the page
		},
		
		exit_property_page:function() {
			if (app.active_property_page ){
				app.Router.navigate("show_diagram",{trigger: true});
			}
		},
		initialize: function() { 
			this.listenTo(app.Pages,'add',this.addQuestDiagramView);
			this.menu_view = new app.MenuView();

		},
		
		addQuestDiagramView: function(page) {
			var view = new app.QuestPageDiagramView({model: page, eventagg: app.eventagg});
		},
		
		create_new_page: function(ev){
			var q_type = $(ev.target).data("page-type");
			var page_num = ++app.pageCount;
			var prototype = app.Attributes[q_type].model.page_prototype;
			var page = new prototype({page_type:q_type, page_number: page_num});
			var x_coord = page.get('x');
			var y_coord = page.get('y');
			//Get the location of next_page:
			if ( app.Pages.length > 0 ){
				var last_page = app.Pages.at(app.Pages.length-1);
				x_coord = (last_page.get('x') + 20 + consts.DIAGRAM_ELEMENT_WIDTH) % window.innerWidth; 
				y_coord = last_page.get('y');
			}
			
			page.set('x',x_coord);
			page.set('y',y_coord);
			
			app.Pages.add(page);
			$("#new_page_menu").css('display','none');
		},
		
		render: function() {
			
		},
		
	});
});