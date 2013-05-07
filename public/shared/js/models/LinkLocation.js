define(['models/Link','models/globals'],function(Link,globals){
	var LinkLocation = Link.extend({
		
		defaults: {
			lat:32.077011086405825,
			lng:34.76827383041382 ,
			txt_street: undefined,
			radius:100, //in meters
			type:'location'
		},
		
		get_label:function(){ 
			var label = Link.prototype.get_label.apply(this,['txt_street']);
			return label;
		},
		initialize:function(){
			this.listenTo(this,"change:radius", this.round_radius);
		},
		round_radius:function() {
			var current = this.get('radius');
			this.set('radius',Math.round(current),{silent:true});
		}
	});
	_.extend(LinkLocation.prototype.defaults, Link.prototype.defaults);
	globals.LinkLocation = LinkLocation;
	return LinkLocation;

});

