define(['Backbone'],function(Backbone){
	var ChangeSafeCollection = Backbone.Collection.extend({
		initialize:function(){
			this.listenTo(this,'add',this.model_added);
		},
		model_added:function(model){
			console.log("Model was added");
			this.listenTo(model,'change',this.invoke_final_add);
		},
		invoke_final_add:function(model) {
			var hasUndef = _.chain(model.attributes).values().contains(undefined).value();
			if ( !hasUndef ){
				this.trigger('change:safe',model); // a change that is safe for commiting. In the future probably replace with validation.
			}
			
		}
	});
	
	return ChangeSafeCollection;
});