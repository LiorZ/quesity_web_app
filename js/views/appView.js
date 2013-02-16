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
			console.log(page);
			app.Pages.add(page);
		},
		
		render: function() {
			
		},
		
	});
});