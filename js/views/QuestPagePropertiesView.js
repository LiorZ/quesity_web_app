var app = app || {};
$(function() {
	
	app.QuestPagePropertiesView = Backbone.View.extend({
		template: undefined,
		id:'#dialog-form',
		className:'quest_page',
		hint_section:undefined,
		events: {
			'click #btn_exit_prop': 'exit_properties_view',
			'focusout #page_title_text':'save_page_title',
			'keypress #page_title_text':'handle_enter_on_title'
		},
		initialize: function(options) {
			this.template = _.template( $(options.template).html() );
		},
		exit_properties_view: function() {
			app.Router.navigate("show_diagram",{trigger: true});
		},
		
		handle_enter_on_title:function(e) {
			if ( e.keyCode == consts.ENTER_KEY_CODE)
				this.$("#page_title_text").blur();
		},
		
		save_page_title:function() {
			var title = this.$("#page_title_text").val();
			this.model.set("page_name",title);
		},
		
		render:function() {
			var type_obj = app.Attributes[this.model.get('page_type')];
			var fill_color = utils.hexToRgb(type_obj.view.fill);
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
		},
		
	});
}());