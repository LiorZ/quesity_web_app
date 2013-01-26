var app = app || {};
$(function() {
	app.MenuView = Backbone.View.extend({
		el:'#toolbar',
		initialize: function() {
			this.listenTo(app.Pages,"add",this.attachListener);
		},
		attachListener: function(element) {
			this.listenTo(element,"show_menu",this.show_menu);
			this.listenTo(element,"hide_menu",this.hide_menu);

		},
		show_menu: function(model,pos,width,height) {
			clearTimeout(app.timeoutId);
			this.$el.css(
					{
						"left": (pos.left)+"px",
						"top":(pos.top - 3*height/4)+"px",
						"display":"inline"
					}
			);
			app.timeoutId = setTimeout(function(){
				menu.css('display','none');
				console.log("menu should be hidden");
			},3500);	
			console.log("Setting timeout " + app.timeoutId);

			
		},
		
		hide_menu: function(model){ 
			menu = this.$el;
			clearTimeout(app.timeoutId);
			app.timeoutId = setTimeout(function(){
				menu.css('display','none');
				console.log("menu should be hidden");
			},500);	
		},
		
		events: {
			'mouseenter': 'cancel_timeout',
			'mouseleave' : 'restart_timeout'
		},
		
		cancel_timeout: function() {
			console.log("Clearing timeout " + app.timeoutId);
			clearTimeout(app.timeoutId);
		},
		restart_timeout: function() {
			var menu = this.$el;
			clearTimeout(app.timeoutId);
			app.timeoutId = setTimeout(function(){
				menu.css('display','none');
			},500);
		}
		
	});
}());