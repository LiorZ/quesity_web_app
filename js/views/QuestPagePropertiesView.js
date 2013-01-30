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
			var type_obj = app.Attributes[this.model.get('page_type')];
			
			var fill_color = utils.hexToRgb(type_obj.view.fill);
			
			this.$el.html(this.template(this.model.toJSON()));
			var size = utils.precentToPixels(0.85);
			this.$el.css({
				display: 'inline',
				width: size.width,
				height: size.height,
				'background-color': 'rgba(' + fill_color.r +',' + fill_color.g + ',' + fill_color.b + ',' +'0.8)'

			});
		    this.$el.css("top", Math.max(0, (($(window).height() - this.$el.outerHeight()) / 2) + 
                    $(window).scrollTop()) + "px");
		    this.$el.css("left", Math.max(0, (($(window).width() - this.$el.outerWidth()) / 2) + 
                    $(window).scrollLeft()) + "px");
		    
		    this.$('img').attr('src',type_obj.view.avatar);
		    console.log(this.$('img').attr('src'));
		    this.$('#type_title').text(type_obj.view.type_title);
		}
	});
}());