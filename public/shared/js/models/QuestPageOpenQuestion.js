define(['models/globals','models/QuestPage','models/Hint','models/LinkAnswer','models/LinkAnswerCollection',
        'models/QuestPageQuestion'],
		function(globals,QuestPage,Hint,LinkAnswer,LinkAnswerCollection,QuestPageQuestion) {
	var QuestPageOpenQuestion = QuestPage.extend({
		initialize:function(options) {
			this.constructor.__super__.initialize.apply(this, [options]);
		}
		
	});
	_.extend(QuestPageOpenQuestion.prototype.defaults, QuestPage.prototype.defaults);
	QuestPageOpenQuestion.prototype.get_next_page = QuestPageQuestion.prototype.get_next_page;
	globals.QuestPageOpenQuestion = QuestPageOpenQuestion;
	return QuestPageOpenQuestion;

});


