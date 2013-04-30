define(['models/globals','models/QuestPage','models/Mixins','models/LinkCollection'], function(globals,QuestPage,Mixins,LinkCollection) {
	var QuestPageStall = QuestPage.extend({
		initialize:function(options) {
			this.constructor.__super__.initialize.apply(this, [options]);
			this.listenTo(this.get('links'),'add',this.handle_add_link);
		},
		
		defaults:
		 {
			stall_time: 0, //in seconds
		},
		
	});
	_.extend(QuestPageStall.prototype.defaults, QuestPage.prototype.defaults);
	_.extend(QuestPageStall.prototype, Mixins.one_child); //enforce one child
	globals.QuestPageStall = QuestPageStall;
	return QuestPageStall;
});
	