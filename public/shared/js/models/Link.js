define(['lib/utils/consts','Backbone','BackboneRelational','models/Mixins'],function(consts,Backbone,BackboneRelational,Mixins) {
	var Link = Backbone.RelationalModel.extend({
		idAttribute: "_id",
		sync:function() {
			return false;
		},
		defaults: {
			type:'regular',
			parent_page:undefined,
			links_to_page:undefined
		},
		get_label: function(property) {
			var txt = this.get(property);
			if ( txt == undefined )
				return '';
			
			if ( txt.length < consts.LABEL_LENGTH ){
				return txt;
			}
			return txt.slice(0,consts.LABEL_LENGTH) + '...';
		}
	});
	_.extend(Link.prototype,Mixins.shallow_json);
	return Link;
});

