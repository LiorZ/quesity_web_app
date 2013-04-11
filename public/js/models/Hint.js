(function() {
	
	'use strict';


	app.Hint = Backbone.Model.extend({
		
		defaults: {
			hint_title:'',
			hint_txt:''
		}
	});
	
	app.HintCollection = Backbone.Collection.extend({
		model: app.Hint
	});
	
}());