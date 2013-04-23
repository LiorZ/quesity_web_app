define(['views/Attributes','lib/utils/consts','Joint','Joint_dia','Joint_dia_org','Joint_dia_uml'],
		function(Attributes,consts,Joint,Joint_dia,Joint_dia_org,Joint_dia_uml){
	
	
	var QuestPageDiagramView = Backbone.View.extend({
		eventagg: undefined,
		jointObj: undefined,
		events: {
			"mouseenter":"show_menu",
			"mouseleave":"hide_menu",
		},
		
		initialize: function(options){ 
			this.eventagg = options.eventagg;
			var relevant_attrs = Attributes[this.model.get('page_type')];
			var jointObj = Joint.dia.org.Member.create({
				rect : {
					x : this.model.get('x'),
					y : this.model.get('y'),
					width : consts.DIAGRAM_ELEMENT_WIDTH,
					height : consts.DIAGRAM_ELEMENT_HEIGHT,
				},
				name : relevant_attrs.view.type_title,
				position :this.model.get("page_name"),
				avatar : relevant_attrs.view.avatar,
				attrs : {
						fill : relevant_attrs.view.fill,
						stroke : 'gray'
					},
				numbering: this.model.get('page_number'),
			});
			var context = this;
			jointObj.registerCallback('elementMoved',function(new_loc){
				context.model.set({x: new_loc.x, y:new_loc.y});
			});
			this.model.set("jointObj", jointObj );
			this.$el = jQuery(jointObj.wrapper.node);
			
			//listens to:
			this.listenTo(this.model,'destroy',this.delete_page);
			this.listenTo(this.model,'change:page_name',this.update_page_name);
		},
		
		update_page_name:function() {
			var jointObj = this.model.get('jointObj');
			var raw_name = this.model.get('page_name');
			var d_name = raw_name;
			if ( raw_name.length > consts.LENGTH_DIAGRAM_TITLE ) {
				d_name = this.model.get('page_name').slice(0,consts.LENGTH_DIAGRAM_TITLE-3) + '...';
			}
			jointObj.properties.position = d_name;
			jointObj.zoom();//does the actual updating ... 
		},
		
		delete_page: function() {
			var jointObj = this.model.get("jointObj");
			jointObj.shadow.remove();
			jointObj.liquidate();
			this.remove();
		},
		show_menu: function(e){
			var jointObj = this.model.get("jointObj");
			var pos = this.$el.offset();
			var width = jointObj.origBBox.width;
			var height = jointObj.origBBox.height;
			this.model.trigger("show_menu",this.model,pos,width,height)
		},
		hide_menu: function(e){
			var posX = e.clientX;
			var posY = e.clientY;
			var pos = this.$el.offset();
			var jointObj = this.model.get("jointObj");

			var width = jointObj.origBBox.width;
			var height = jointObj.origBBox.height;
			if ( (posX >= pos.left && posX <= pos.left+width) && (posY >= pos.top && posY <= pos.top+height) )
				return;
			this.model.trigger("hide_menu",this.model);
		},
		
	});	
	
	return QuestPageDiagramView;
})