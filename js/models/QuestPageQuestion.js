(function() {
	
	'use strict';


	app.QuestPageQuestion = app.QuestPage.extend({
		initialize:function(options) {
			this.constructor.__super__.initialize.apply(this, [options]);
			this.set('hints',new app.HintCollection());
			this.set('answers', new app.LinkAnswerCollection());
			this.listenTo(this.get('answers'),'add',this.add_parent);
		},
		defaults:
		 {
			answers: new app.LinkAnswerCollection(),
			hints: new app.HintCollection()
		},
		add_parent:function(new_answer) {
			new_answer.set('parent_page',this);
		}
		
	});
	_.extend(app.QuestPageQuestion.prototype.defaults, app.QuestPage.prototype.defaults);
//	_.extend(app.QuestPageQuestion.prototype.defaults, app.ParentAdder);
}());
