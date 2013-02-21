var app = app || {};
$(function() {
	
	app.EditableRowDialog = Backbone.View.extend({
		initialize: function(options) {
			this.template = _.template( $(options.dialog_template).html() );
			if ( options.binding) this.binding = options.binding;
		},
		render:function(collection) {
			var model = this.model;
			var context = this;
			this.$el.html(this.template(model.toJSON()));
			$("body").append(this.$el);
			var dialog_obj = this.$el.find("#dialog_form");
			dialog_obj.dialog({
			      autoOpen: false,
			      height: 300,
			      width: 350,
			      modal: true,
			      buttons:{
			    	  OK: function(){
			    		  _.bindAll(context.save_object);
			    		  context.save_object(dialog_obj,collection);
			    	  },
			    	  Cancel: function() {
			    		  $(this).dialog("close");
			    		  context.remove();
			    	  }
			    	  
			      }
			});
			this.$el = dialog_obj;
			dialog_obj.dialog("open");
		}, 
		save_object: function(dialog_obj,collection) {
			if (  this.binding ) 
	  			for (obj in this.binding){
					this.model.set(this.binding[obj], dialog_obj.find(obj).val());
					dialog_obj.find(obj).val('');
				}
    		dialog_obj.dialog("close");
    		  if (collection){
    			  collection.add(this.model);
    		  }
    		this.remove();
		}
		
	})}());