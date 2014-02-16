define([],function() {
	var mixins = {
			one_child: {
				handle_add_link:function(new_link,collection) {
					new_link.set('parent_page',this,{silent:true});
					if ( collection.length > 1){
						var prev_page = collection.shift();
						prev_page.destroy();
					}
				}
			},
			
			shallow_json: {
				toJSON:function(options){
					if ( !options || !options.shallow){
						return Backbone.RelationalModel.prototype.toJSON.apply(this,[]);
					}
					if ( options.shallow ) {
						return Backbone.Model.prototype.toJSON.apply(this,[]);
					}
					return Backbone.RelationalModel.prototype.toJSON.apply(this,[]);
				}
			},
			local_attrs: {
				toJSON:function() {
					var local_attrs = this.localAttrs || [];
					var temp = {};
					_.each(local_attrs,function(attr){
						temp[attr] = this.get(attr) || '';
						this.unset(attr,{silent:true});
					});
					var jsonObj = Backbone.RelationalModel.prototype.clone.toJSON(this);
					this.set(temp,{silent:true});
					return jsonObj;
				}
			}
	};
	return mixins;
});
