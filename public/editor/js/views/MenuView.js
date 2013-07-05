define(['jQueryUI','EasingMenu'],function(jQueryUI,EasingMenu) {
	var MenuView = Backbone.View.extend({
		el:'#toolbar',
		events: {
			'mouseenter': 'cancel_timeout',
			'mouseleave' : 'restart_timeout',
			'click #btn_delete':'delete_page',
			'click #btn_edit':'show_properties_page',
		},
		pages:undefined,
		timeoutId:undefined,
		initialize: function(options) {
			this.pages = options.pages;
			var context = this;
			this.pages.each(function(element){context.attachListener(element)}); //Add to existing pages!
			
			this.listenTo(this.pages,"add",this.attachListener);
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
			$("#new_page_menu").menu();
			var menu_container_start_left = $("#menu").css('left');
			
			$("#menu").make_menu({
				start_loc: {left  : 0}, 
				start_method: {duration: 1000, method: 'easeInSine'},
				end_loc: {left:menu_container_start_left},
				end_method:{duration: 1000, method: 'easeOutSine'},
				menu_fold_callback: function() { $("#new_page_menu").css('display','none'); }
			});
		},
		attachListener: function(element) {
			this.listenTo(element,"show_menu",this.show_menu);
			this.listenTo(element,"hide_menu",this.hide_menu);

		},
		
		show_properties_page:function() {
			var page_number = this.model.get("page_number");
			window.location.hash = "page/"+page_number;
		},
		delete_page: function(e) {
			console.log("Destroying " + this.model.get('page_name'));
			this.model.stopListening();
			this.model.destroy();
			this.hide_menu(undefined,0);
		},
		show_menu: function(model,pos,width,height) {
			clearTimeout(this.timeoutId);
			this.$el.css(
					{
						"left": (pos.left)+"px",
						"top":(pos.top - 3*height/4)+"px",
						"display":"inline"
					}
			);
			var menu = this.$el;
			var menuObj = this;
			this.timeoutId = setTimeout(function(){
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
			clearTimeout(this.timeoutId);
			var menuObj = this;
			this.timeoutId = setTimeout(function(){
				menu.css('display','none');
				menuObj.model = undefined;
			},tout);	
		},
		
		cancel_timeout: function() {
			clearTimeout(this.timeoutId);
		},
		restart_timeout: function() {
			var menu = this.$el;
			clearTimeout(this.timeoutId);
			var menuObj = this;
			this.timeoutId = setTimeout(function(){
				menu.css('display','none');
				menuObj.model = undefined;

			},500);
		}
		
	});
	
	return MenuView;
});
