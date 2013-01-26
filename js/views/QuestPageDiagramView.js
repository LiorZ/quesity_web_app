var app = app || {};
$(function() {
	
	app.QuestPageDiagramView = Backbone.View.extend({
		eventagg: undefined,
		jointObj: undefined,
		connection_btn: undefined,
		events: {
			"mouseenter":"mouse_enter",
			"mouseleave":"mouseleave"
		},
		initialize: function(options){ 
			this.eventagg = options.eventagg;
			var relevant_attrs = app.Attributes[this.model.get('page_type')];
			this.jointObj = Joint.dia.org.Member.create({
				rect : {
					x : this.model.get('x'),
					y : this.model.get('y'),
					width : 180,
					height : 60
				},
				name : relevant_attrs.view.type_title,
				position :this.model.get("page_name"),
				avatar : relevant_attrs.view.avatar,
				attrs : {
						fill : relevant_attrs.view.fill,
						stroke : 'gray'
					}
			});
			this.$el = jQuery(this.jointObj.wrapper.node);
			this.connection_btn = new app.ConnectionButtonView();
			
		},
		mouse_enter: function(e){
			var pos = this.$el.offset();
			var width = this.jointObj.origBBox.width;
			var height = this.jointObj.origBBox.height;
			console.log(this.connection_btn.render());
//			this.$el.$("#btn_connection").css(
//						{
//							"left": (pos.left + width)+"px",
//							"top":(pos.top + height/4)+"px",
//							"display":"inline"
//						}
//			).show();
			clearTimeout(app.timeoutId);
		},
		mouseleave: function(e){
			var posX = e.clientX;
			var posY = e.clientY;
			var pos = this.$el.offset();
			var width = this.jointObj.origBBox.width;
			var height = this.jointObj.origBBox.height;
			if ( (posX >= pos.left && posX <= pos.left+width) && (posY >= pos.top && posY <= pos.top+height) )
				return;
			app.timeoutId = setTimeout(function(){
				$("#btn_connection").css('display','none');
			},500);
			
		}
		
	});
	
});