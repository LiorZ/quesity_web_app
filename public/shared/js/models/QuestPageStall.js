define(['models/QuestPage','models/Mixins','models/LinkCollection'], function(QuestPage,Mixins,LinkCollection) {
	var QuestPageStall = QuestPage.extend({
		initialize:function(options) {
			this.constructor.__super__.initialize.apply(this, [options]);
//			this.set('links', new LinkCollection());
			this.listenTo(this.get('links'),'add',this.handle_add_link);
		},
		
		defaults:
		 {
			stall_time: undefined, //in seconds
		},
		
	});
	_.extend(QuestPageStall.prototype.defaults, QuestPage.prototype.defaults);
	_.extend(QuestPageStall.prototype, Mixins.one_child); //enforce one child
	QuestPage._subModels['stall'] = QuestPageStall;

	return QuestPageStall;
});
	