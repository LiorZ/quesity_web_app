var app = app || {};
$(function() {
	
	app.ConnectionButtonView = Backbone.View.extend({
		tagName:'button',
		className:'smaller_fonts btn_connection',
		initialize: function() {
			this.$el.button();
		},
		render: function() {
			return this.$el.css('display','inline').show();
		},
		events: {
			'mouseenter': 'cancel_timeout',
			'mouseleave' : 'restart_timeout'
		},
		
		cancel_timeout: function() {
//			clearTimeout(app.timeoutId);
		},
		restart_timeout: function() {
//			app.timeoutId = setTimeout(function(){
//				$("#btn_connection").css('display','none');
//			},500);
		}
		
	});
});