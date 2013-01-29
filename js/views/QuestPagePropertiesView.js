var app = app || {};
$(function() {
	
	app.QuestPagePropertiesView = Backbone.View.extend({
		template: undefined,
		el:'#dialog-form',
		initialize: function(options) {
			console.log("Template: ");
			console.log($(options.template).html());
			this.template = _.template( $(options.template).html() );
			
		},
		render:function() {
			this.$el.empty();	
			this.$el.html(this.template(this.model.toJSON));
			var size = utils.precentToPixels(0.85);
			this.$el.css({
				display: 'inline',
				width: size.width,
				height: size.height,
			});
		    this.$el.css("top", Math.max(0, (($(window).height() - this.$el.outerHeight()) / 2) + 
                    $(window).scrollTop()) + "px");
		    this.$el.css("left", Math.max(0, (($(window).width() - this.$el.outerWidth()) / 2) + 
                    $(window).scrollLeft()) + "px");
			console.log(this.$el.html());
		}
	});
}());