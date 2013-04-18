define(['lib/utils/consts'],function(consts) {
	var Link = Backbone.Model.extend({
		
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

