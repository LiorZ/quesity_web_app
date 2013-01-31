var app = app || {};
$(function() {
	
	app.QuestPageLocationPropertiesView = app.QuestPagePropertiesView.extend({
		initialize: function(options) {
			this.constructor.__super__.initialize.apply(this, [options])
			this.listenTo(this.model.get('hints'),'add',this.render);
			this.listenTo(this.model.get('locations'),'change',this.render);
		}
	});
}());