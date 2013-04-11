(function() {
	
	'use strict';


	app.LinkAnswer = app.Link.extend({
		
		defaults: {
			answer_txt:'',
		},
		get_label:function() {
			var label = app.Link.prototype.get_label.apply(this,['answer_txt']);
			return label;
		}
	});
	_.extend(app.LinkAnswer.prototype.defaults, app.Link.prototype.defaults);

	app.LinkAnswerCollection = Backbone.Collection.extend({
		model: app.LinkAnswer,
	});
	
}());