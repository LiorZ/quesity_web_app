define(['Joint'],function(Joint) {
	var LinkView = Backbone.View.extend({

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
				
				this.update_vertices(jointObj);
				
				this.listen_to_moving(parent_page);
				this.listen_to_moving(links_to_page);
				
				
				//Disable dragging of start cap:
				var quest_model = parent_page.get('quest')
				var pages = quest_model.get('pages');
				jointObj.registerForever(pages.as_joints_array());
				var context = this;
				jointObj.registerCallback("justConnected", function(side) {
					if (side == "end") {
						var page_model = pages.byJointObject(this);
						if (page_model == undefined)
							return;
						//TODO: What if someone tries to manually connect a surprise page? (which shouldn't be connected to anything)
						if (parent_page != page_model){
							var prev_link = context.model.get('links_to_page');
							context.model.set('links_to_page', page_model, {mode:'diagram'});
							if ( prev_link != undefined ) {
								context.stopListening(prev_link);
								context.model.stopListening(prev_link);
								context.stop_listen_to_moving(prev_link);
								prev_link.stopListening(context.model);
							}
							context.listenTo(page_model,'destroy',context.destroy_view_model);
							context.listen_to_moving(page_model);
							context.update_vertices(jointObj);

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

			var context = this;
			// Listens to:

			this.listenTo(parent_page, 'destroy', this.unbind_listners);
			this.listenTo(model, 'destroy', this.destroy_view); // destroy just the view, avoid long recursion...
			this.listenTo(links_to_page,'destroy',this.destroy_view_model);
			this.listenTo(model,"change:links_to_page",this.page_changed_event);
			var links = parent_page.get('links');
			this.listenTo(parent_page,'change:links',this.handle_parent_links_changed);
			
			//Listen to an event in which one of the pages changes its target. Needs to know that in order to reorganize the other connections properly.
			this.listenTo(links,'change:links_to_page',function(model) {
				//Handle cases in which the target is destroyed:
				if ( model.get('links_to_page') == null ){
					return;
				}
				context.update_vertices(context.jointObj);
			});
			var props_to_listen = this.model.get_link_view_properties_to_listen();
			if (!_.isUndefined(props_to_listen) && props_to_listen.length > 0){
				var listen_str = _.chain(props_to_listen).map(function(item){ return "change:" + item;}).toArray().value().join(" ");
				this.listenTo(model,listen_str,this.page_changed_event);
			}
		},
		
		handle_parent_links_changed:function(model, collection, options) {
			if ( model == this.model || this.model.get('parent_page') == null || this.model.get('links_to_page') == null)
				return;
			
			this.update_vertices(this.jointObj);
			
		},
		
		update_vertices: function(jointObj) {
			var model = this.model;
			var parent_page = model.get('parent_page');
			var links_to_page = model.get('links_to_page');
			var pos_in_array = this.pos_in_array(parent_page,links_to_page);
			if ( pos_in_array > 1 ) {
				var middle_point = {x: (parent_page.get('x') + links_to_page.get('x'))/pos_in_array, y: (parent_page.get('y') + links_to_page.get('y') )/pos_in_array}
				jointObj.setVertices([middle_point]).setSmoothing(true);
			}else {
				jointObj.setVertices([]);
			}
		},
		
		listen_to_moving:function(page) {
			var page_jointObj = page.get('jointObj');
			var context = this;
			var func = function(new_loc) {
				console.log("Moving ... ");
				context.update_vertices(context.jointObj);
			};
			var identifier = context.model.id+page.id;
			
			page_jointObj.registerCallback('elementMoved',func,identifier); 
			
			page.listenTo(this.model,'destroy',function() {
				console.log("Trying to unregister " + identifier);
				page_jointObj.unRegisterCallback('elementMoved',identifier);
			});
		},
		stop_listen_to_moving: function(page) {
			var page_jointObj = page.get('jointObj');
			var context = this;
			var identifier = context.model.id+page.id;
			page_jointObj.unRegisterCallback('elementMoved',identifier);
		},
		destroy_view_model:function (model, collection, options) {
			this.unbind_listners();
			this.model.destroy();
		},
		
		unbind_listners: function() {
			var links_to_page = this.model.get('links_to_page');
			var parent_page = this.model.get('parent_page');
			links_to_page != undefined && this.stop_listen_to_moving(links_to_page);
			parent_page != undefined && this.stop_listen_to_moving(parent_page);
		},
		destroy_view : function() {
//			Joint.dia.remove_joint(this.jointObj);
			this.remove();
		},
		
		page_changed_event : function(model,gogo,options) {
			//This event gets fired when the model is destroyed. This if prevents the function to run in that case.
			if ( model.get('links_to_page') == null || model.get('parent_page') == null ) {
				return;
			}
			/*The following is an ugly workaround for a bug that behaves like the following: when changing the connection between pages from within a pages, everything works fine.
			 * But if we change the connection from the diagram, it goes out of sync. it appears that invoking {silent:true} from the change event in the 'justConnected' callback 
			 * causes the model to be out of sync for some reason. For that reason I added a {mode:...} object so that I know when to erase the object and when not.
			 */
			if ( options != undefined && options.mode == 'diagram'){
				return;
			}
			Joint.dia.remove_joint(this.jointObj);
			this.remove();
		},
		
		pos_in_array:function(origin,target) {
			var links = origin.get('links');
			if (links == undefined || links.length == 0 ){
				return 0;
			}
			var same_links = links.chain().filter(function(l) {
				return l.get('links_to_page') == target;
			}).sortBy(function(l) {return l.id;}).value();
			for(var i=0; i<same_links.length; ++i){
				var l = same_links[i];
				if ( l.id == this.model.id){
					return i+1;
				}
			}
			return 0;
		}

	})
	return LinkView;
});