define(['models/globals','models/QuestPage','models/Hint','models/LinkAnswer','models/LinkAnswerCollection'],
		function(globals,QuestPage,Hint,LinkAnswer,LinkAnswerCollection) {
	var QuestPageQuestion = QuestPage.extend({
		initialize:function(options) {
			this.constructor.__super__.initialize.apply(this, [options]);
//			this.set('hints',new HintCollection());
//			this.set('answers', new LinkAnswerCollection());
//			this.listenTo(this.get('answers'),'add',this.add_parent);
		},
		get_next_page: function(raw_answer) {
			var answer = $.trim(raw_answer);
			var links = this.get('links');
			var correct_link = links.findWhere({answer_txt: answer});
			if ( _.isUndefined(correct_link) || _.isNull(correct_link) ){
				console.log("Cant find answer");
				return undefined;
			}
			console.log("Found answer!");
			return correct_link.get('links_to_page');
		}
//		add_parent:function(new_answer) {
//			new_answer.set('parent_page',this);
//		}
		
	});
	_.extend(QuestPageQuestion.prototype.defaults, QuestPage.prototype.defaults);
	globals.QuestPageQuestion = QuestPageQuestion;
	return QuestPageQuestion;

});


