var app = app || {};
$(function() {
	
	app.LinkView = Backbone.View.extend({
		
	    
		initialize: function() {
			var model = this.model;
			var parent_page = model.get('parent_page');
			var links_to_page = model.get('links_to_page');
			
			var parent_joint = parent_page.get('jointObj');
			var target_joint = links_to_page.get('jointObj');
			if ( parent_joint != target_joint ){
				var jointObj = parent_joint.joint(target_joint,Joint.dia.uml.arrow).label(model.get_label());
			}
		},
		
		render:function() {

		}
		
	})}());