var app = app || {};
$(function() {
	
	app.QuestPageDiagramView = Backbone.View.extend({
		eventagg: undefined,
		jointObj: undefined,
		events: {
			"mouseenter":"show_menu",
			"mouseleave":"hide_menu",
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
					},
				numbering: this.model.get('page_number')
			});
			this.$el = jQuery(this.jointObj.wrapper.node);
			
			//listens to:
			this.listenTo(this.model,'destroy',this.delete_page);
		},
		delete_page: function() {
			this.jointObj.remove();
			this.jointObj.shadow.remove(); 
			this.remove();
		},
		show_menu: function(e){
			var pos = this.$el.offset();
			var width = this.jointObj.origBBox.width;
			var height = this.jointObj.origBBox.height;
			this.model.trigger("show_menu",this.model,pos,width,height)
		},
		hide_menu: function(e){
			var posX = e.clientX;
			var posY = e.clientY;
			var pos = this.$el.offset();
			var width = this.jointObj.origBBox.width;
			var height = this.jointObj.origBBox.height;
			if ( (posX >= pos.left && posX <= pos.left+width) && (posY >= pos.top && posY <= pos.top+height) )
				return;
			this.model.trigger("hide_menu",this.model);
		}
		
	});
	
});