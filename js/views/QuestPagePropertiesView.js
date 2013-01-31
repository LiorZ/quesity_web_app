var app = app || {};
$(function() {
	
	app.QuestPagePropertiesView = Backbone.View.extend({
		template: undefined,
		id:'#dialog-form',
		className:'quest_page',
		events: {
			'click #btn_add_hint': 'add_hint',
			'click #btn_exit_prop': 'exit_properties_view'
		},
		initialize: function(options) {
			this.template = _.template( $(options.template).html() );
		},
		exit_properties_view: function() {
			this.remove();
		},
		add_hint: function() {
			var dialog = new app.NewHintView({model:this.model});
			dialog.render();
		},
		
		render:function() {
			console.log("Rendering properties page...");
			var type_obj = app.Attributes[this.model.get('page_type')];
			var fill_color = utils.hexToRgb(type_obj.view.fill);
			console.log(this.model.toJSON());
			this.$el.html(this.template({data:this.model.toJSON()}));
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
		    this.$('#type_title').text(type_obj.view.type_title);
		    this.$('#locations').tablesorter();
		    $('body').append(this.$el);
		}
	});
}());