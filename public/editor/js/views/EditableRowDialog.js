define(["jQueryUI"],function(jQueryUI) {
	var EditableRowDialog = Backbone.View.extend({
		initialize: function(options) {
			this.template = _.template( $(options.dialog_template).html() );
			
			if ( options.binding) this.binding = options.binding;
			if ( options.dialog_size ) this.dialog_size = options.dialog_size;
			else{
				alert ("Dialog not defined!");
			}
			this.model_prototype_options = options.model_prototype_options || {};
			this.edit_mode = options.edit_mode;
			
		},
		render:function() {
			var model = this.model;
			var context = this;
			if (this.edit_mode)
				this.$el.html(this.template({data: model.toJSON({shallow:true})}));
			else {
				var data = {parent_page: this.model.parent};
				this.$el.html(this.template({data:data}));
			}
			$("body").append(this.$el);
			var dialog_obj = this.$el.find("#dialog_form");
			dialog_obj.dialog({
			      autoOpen: false,
			      height: context.dialog_size.height,
			      width: context.dialog_size.width,
			      modal: true,
			      buttons:{
			    	  OK: function(){
			    		  _.bindAll(context.save_object);
			    		  context.save_object(dialog_obj);
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
		save_object: function(dialog_obj,more_options) {
			var creation_options = {};
			if (  this.binding ) 
	  			for (obj in this.binding){
					creation_options[this.binding[obj]] = dialog_obj.find(obj).val();
					dialog_obj.find(obj).val('');
				}
    		dialog_obj.dialog("close");
//  		  if (collection){
//  			  collection.add(this.model);
//  		  }
    		this.remove();
  		
			var row_model = _.chain(this.model_prototype_options).extend(creation_options).extend(more_options||{}).value();
			if (this.edit_mode){
				this.model.set(row_model);
				return this.model;
			}else{
				var new_row = this.model.create(row_model);
				return new_row;
			}
			
		}
	});
	return EditableRowDialog;
});
