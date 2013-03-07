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
							var prev_link = context.model.get('links_to_page');
							context.model.set('links_to_page', page_model, {mode:'diagram'});
							if ( prev_link != undefined ) context.stopListening(prev_link);
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
			this.listenTo(model,"change:links_to_page",this.page_changed_event);
		},
		destroy_view_model:function() {
			this.model.destroy();
		},
		destroy_view : function() {
			Joint.dia.remove_joint(this.jointObj);
			this.remove();
		},
		
		page_changed_event : function(model,gogo,options) {

			/*The following is an ugly workaround for a bug that behaves like the following: when changing the connection between pages from within a pages, everything works fine.
			 * But if we change the connection from the diagram, it goes out of sync. it appears that invoking {silent:true} from the change event in the 'justConnected' callback 
			 * causes the model to be out of sync for some reason. For that reason I added a {mode:...} object so that I know when to erase the object and when not.
			 */
			if ( options != undefined && options.mode == 'diagram'){
				return;
			}
			Joint.dia.remove_joint(this.jointObj);
			this.remove();
		}

	})
}());