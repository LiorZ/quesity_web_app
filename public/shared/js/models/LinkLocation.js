define(['models/Link'],function(Link){
	var LinkLocation = Link.extend({
		
		defaults: {
			lat:undefined,
			lng:undefined,
			txt_street: '',
			radius:100, //in meters
			type:'location'
		},
		
		get_label:function(){ 
			var label = Link.prototype.get_label.apply(this,['txt_street']);
			return label;
		}
	});
	_.extend(LinkLocation.prototype.defaults, Link.prototype.defaults);
	Link._subModels['location'] = LinkLocation;

	return LinkLocation;

});

