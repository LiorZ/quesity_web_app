define(['models/QuestPage','models/Hint','models/LinkAnswer'],function(QuestPage,Hint,LinkAnswer) {
	var QuestPageQuestion = QuestPage.extend({
		
		relations: [{
			type: Backbone.HasMany,
			key: 'answers',
			relatedModel: LinkAnswer,
			reverseRelation: {
				key: 'parent_page',
				includeInJSON: '_id'
			}
		},
		{
			type: Backbone.HasMany,
			key: 'hints',
			relatedModel: Hint,
			reverseRelation: {
				key: 'parent_page',
				includeInJSON: '_id'
			}
		}],
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
	return QuestPageQuestion;

});


