var app = app || {};
$(function( $ ) {
	
	var vent = _.extend({}, Backbone.Events);
	
	app.AppView = Backbone.View.extend({
		el: '#container',
		
		events: {
			'click li a': 'create_new_page',
		},
		
		
		initialize: function() { 
			this.listenTo(app.Pages,'add',this.addQuestDiagramView);
		},
		
		addQuestDiagramView: function(page) {
			var view = new app.QuestPageDiagramView({model: page, eventagg: vent});
		},
		
		create_new_page: function(ev){
			var q_type = $(ev.target).data("page-type");
			app.Pages.add(new app.QuestPage({page_type:q_type}));
		},
		
		render: function() {
			
		},
		
	});
});