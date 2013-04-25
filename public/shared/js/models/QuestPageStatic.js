define(['models/QuestPage','models/LinkCollection','models/Mixins'],function(QuestPage,LinkCollection,Mixins) {
	var QuestPageStatic = QuestPage.extend({
		initialize:function(options) {
			this.constructor.__super__.initialize.apply(this, [options]);
			this.listenTo(this.get('links'),'add',this.handle_add_link);
		},
		
		
	});
	_.extend(QuestPageStatic.prototype.defaults, QuestPage.prototype.defaults);
	_.extend(QuestPageStatic.prototype, Mixins.one_child);
	
	QuestPage._subModels['static'] = QuestPageStatic;

	return QuestPageStatic;
});
