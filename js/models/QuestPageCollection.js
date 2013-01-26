var app = app || {};

(function() {
	
	var QuestPageList = Backbone.Collection.extend({
		model: app.QuestPage,
		
//		initialize: function() {
//			this.listenTo(this,'add',this.addModelListener);
//		},
//		
//		addModelListener: function(model,attributes) {
//			this.listenTo(model,"change",this.invokeChangeEvent);
//		},
//		
//		invokeChangeEvent: function(model,attributes) { 
//			console.log("The collection recorded a model change" + model);
//		}
		
	});
	
	app.Pages = new QuestPageList();
}());