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
		initialize: function() {
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
			var prop_page = new app.QuestPageLocationPropertiesView({model:this.model, template:'#tmpl_page_location'});
			prop_page.render();
		},
		
		delete_page: function(e) {
			console.log("Destroying " + this.model.get('page_name'));
			this.model.destroy();
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
		
		hide_menu: function(model){ 
			menu = this.$el;
			clearTimeout(app.timeoutId);
			var menuObj = this;
			app.timeoutId = setTimeout(function(){
				menu.css('display','none');
				menuObj.model = undefined;
			},500);	
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