var app = app || {};
$(function( $ ) {
	
	var vent = _.extend({}, Backbone.Events);
	
	app.AppView = Backbone.View.extend({
		el: '#container',
		menu_view:undefined,
		events: {
			'click li a': 'create_new_page',
		},
		
		
		initialize: function() { 
			this.listenTo(app.Pages,'add',this.addQuestDiagramView);
			this.menu_view = new app.MenuView();

		},
		
		addQuestDiagramView: function(page) {
			var view = new app.QuestPageDiagramView({model: page, eventagg: vent});
		},
		
		create_new_page: function(ev){
			var q_type = $(ev.target).data("page-type");
			var page_num = ++app.pageCount;
			var page = new app.QuestPageLocation({page_type:q_type, page_number: page_num, hints: new app.HintCollection()});
			console.log(page);
			app.Pages.add(page);
		},
		
		render: function() {
			
		},
		
	});
});