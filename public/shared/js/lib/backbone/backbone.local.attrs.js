/**
 * A backbonejs model that supports local attributes via the localAttrs key, these keys will not be present in the json rep of the model.
 * Example:
 * 
 */
(function(){
	Backbone.Model.Local = Backbone.Model.extend({
		toJSON:function() {
			var local_attrs = this.localAttrs || [];
			var temp = {};
			_.each(local_attrs,function(attr){
				temp[attr] = this.get(attr) || '';
				this.unset(attr,{silent:true});
			})
			var jsonObj = Backbone.Model.prototype.clone.toJSON(this);
			this.set(temp,{silent:true});
			return jsonObj;
		}
	}) ;
}).call(this);
