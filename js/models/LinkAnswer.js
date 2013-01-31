(function() {
	
	'use strict';


	app.LinkAnswer = Backbone.Model.extend({
		
		defaults: {
			answer_txt:'',
			links_to_page: undefined,
			parent_page: undefined,
		},
		get_label:function() {
			var answer_txt = this.get('answer_txt');
			if ( answer_txt < consts.LABEL_LENGTH ){
				return answer_txt;
			}
			return answer_txt.slice(0,consts.LABEL_LENGTH);
		}
	});
	
	app.LinkAnswerCollection = Backbone.Collection.extend({
		model: app.LinkAnswer,
	});
	
}());