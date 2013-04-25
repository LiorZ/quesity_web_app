define(['models/Link','models/globals'],function(Link,globals){
	var LinkLocation = Link.extend({
		
		defaults: {
			lat:undefined,
			lng:undefined,
			txt_street: undefined,
			radius:100, //in meters
			type:'location'
		},
		
		get_label:function(){ 
			var label = Link.prototype.get_label.apply(this,['txt_street']);
			return label;
		}
	});
	_.extend(LinkLocation.prototype.defaults, Link.prototype.defaults);
	globals.LinkLocation = LinkLocation;
	return LinkLocation;

});

