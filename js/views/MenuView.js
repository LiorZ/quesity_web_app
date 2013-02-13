var app = app || {};
$(function() {
	app.MenuView = Backbone.View.extend({
		el:'#toolbar',
		events: {
			'mouseenter': 'cancel_timeout',
			'mouseleave' : 'restart_timeout',
			'click #btn_delete':'delete_page',
			'click #btn_edit':'show_properties_page'
		},
		initialize: function(options) {
			this.listenTo(app.Pages,"add",this.attachListener);
			this.$("#btn_delete").button( {
				text: false,	
				icons: {
					primary: "ui-icon-trash"
				}
			});
			
			this.$("#btn_edit").button( {
				text: false,
				icons: {
					primary: "ui-icon-pencil"
				}
			});
			
		},
		attachListener: function(element) {
			this.listenTo(element,"show_menu",this.show_menu);
			this.listenTo(element,"hide_menu",this.hide_menu);

		},
		
		show_properties_page:function() {
			var template_id = app.Attributes[this.model.get('page_type')].view.properties_template;
			var properties_prototype = app.Attributes[this.model.get('page_type')].view.properties_prototype;
			var prop_page = new properties_prototype({model:this.model, template:template_id});
			prop_page.render();
		},
		
		delete_page: function(e) {
			console.log("Destroying " + this.model.get('page_name'));
			this.model.destroy();
			this.hide_menu(undefined,0);
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
			var menuObj = this;
			app.timeoutId = setTimeout(function(){
				menu.css('display','none');
				menuObj.model = undefined;
			},3500);	
			this.model = model;
			
		},
		
		hide_menu: function(model,t){
			var tout=t;
			if ( t == undefined ){
				tout = 500;
			}
			menu = this.$el;
			clearTimeout(app.timeoutId);
			var menuObj = this;
			app.timeoutId = setTimeout(function(){
				menu.css('display','none');
				menuObj.model = undefined;
			},tout);	
		},
		
		cancel_timeout: function() {
			clearTimeout(app.timeoutId);
		},
		restart_timeout: function() {
			var menu = this.$el;
			clearTimeout(app.timeoutId);
			var menuObj = this;
			app.timeoutId = setTimeout(function(){
				menu.css('display','none');
				menuObj.model = undefined;

			},500);
		}
		
	});
}());