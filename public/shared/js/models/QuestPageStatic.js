define(['models/globals','models/QuestPage','models/LinkCollection','models/Mixins'],function(globals,QuestPage,LinkCollection,Mixins) {
	var QuestPageStatic = QuestPage.extend({
		initialize:function(options) {
			this.constructor.__super__.initialize.apply(this, [options]);
			this.listenTo(this.get('links'),'add',this.handle_add_link);
		},
		
		get_next_page: function() {
			var links = this.get('links');
			if ( links.size() > 0)
				return links.at(0).get('links_to_page');
			return undefined;
		}
	});
	_.extend(QuestPageStatic.prototype.defaults, QuestPage.prototype.defaults);
	_.extend(QuestPageStatic.prototype, Mixins.one_child);
	
//	QuestPage._subModels['static'] = QuestPageStatic;
	globals.QuestPageStatic = QuestPageStatic;
	return QuestPageStatic;
});
