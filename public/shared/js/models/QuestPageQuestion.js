define(['models/QuestPage','models/Hint','models/LinkAnswer'],function(QuestPage,Hint,LinkAnswer) {
	var QuestPageQuestion = QuestPage.extend({
		initialize:function(options) {
			this.constructor.__super__.initialize.apply(this, [options]);
//			this.set('hints',new HintCollection());
//			this.set('answers', new LinkAnswerCollection());
//			this.listenTo(this.get('answers'),'add',this.add_parent);
		},
//		defaults:
//		 {
//			answers: new LinkAnswerCollection(),
//			hints: new HintCollection()
//		},
//		add_parent:function(new_answer) {
//			new_answer.set('parent_page',this);
//		}
		
	});
	_.extend(QuestPageQuestion.prototype.defaults, QuestPage.prototype.defaults);
	QuestPage._subModels['question'] = QuestPageQuestion;
	
	return QuestPageQuestion;

});


