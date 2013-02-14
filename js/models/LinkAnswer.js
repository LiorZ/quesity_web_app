(function() {
	
	'use strict';


	app.LinkAnswer = app.Link.extend({
		
		defaults: {
			answer_txt:'',
		},
		get_label:function() {
			var answer_txt = this.get('answer_txt');
			if ( answer_txt < consts.LABEL_LENGTH ){
				return answer_txt;
			}
			return answer_txt.slice(0,consts.LABEL_LENGTH);
		}
	});
	_.extend(app.LinkAnswer.prototype.defaults, app.Link.prototype.defaults);

	app.LinkAnswerCollection = Backbone.Collection.extend({
		model: app.LinkAnswer,
	});
	
}());