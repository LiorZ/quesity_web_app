define(['lib/utils/consts','Backbone','BackboneRelational'],function(consts,Backbone,BackboneRelational) {
	var Link = Backbone.RelationalModel.extend({
		
		defaults: {
			links_to_page: undefined,
			parent_page: undefined,
			type:'regular'
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
	
	return Link;
});

