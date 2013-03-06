var app = app || {};
$(function() {

	app.LinkView = Backbone.View.extend({

		jointObj : undefined,
		initialize : function() {
			var model = this.model;
			var parent_page = model.get('parent_page');
			var links_to_page = model.get('links_to_page');

			var parent_joint = parent_page.get('jointObj');
			var target_joint = links_to_page.get('jointObj');
			if (parent_joint != target_joint) {
				var jointObj;
				if ( model.get_label() )
					jointObj = parent_joint.joint(target_joint,
						Joint.dia.uml.arrow).label(model.get_label());
				else{
					jointObj = parent_joint.joint(target_joint,
							Joint.dia.uml.arrow);
				}
				
				//Disable dragging of start cap:
				
				jointObj.registerForever(app.Pages.as_joints_array());
				var context = this;
				jointObj.registerCallback("justConnected", function(side) {
					if (side == "end") {

						var page_model = app.Pages.byJointObject(this);
						if (page_model == undefined)
							return;
						
						if (parent_page != page_model){
							context.model.set('links_to_page', page_model);
							context.listenTo(page_model,'destroy',context.destroy_view_model);
						}
					}
				});
				
				jointObj.registerCallback("floating", function(side) {
					if ( side == "end") {
						jointObj.back_to_previous_node('end');
					}
				});
				this.jointObj = jointObj;
			}

			// Listens to:

			this.listenTo(parent_page, 'destroy', this.destroy_view_model);
			this.listenTo(model, 'destroy', this.destroy_view); // destroy just the view, avoid long recursion...
			this.listenTo(links_to_page,'destroy',this.destroy_view_model);
			this.listenTo(model,'change:links_to_page',this.destroy_view);

		},
		destroy_view_model:function() {
			this.model.destroy();
		},
		destroy_view : function() {
			Joint.dia.remove_joint(this.jointObj);
			this.remove();
		},
		
		render : function() {

		}

	})
}());