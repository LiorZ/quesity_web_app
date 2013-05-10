define(['models/Link','models/globals'],function(Link,globals){
	var LinkLocation = Link.extend({
		
		defaults: {
			lat:32.077011086405825,
			lng:34.76827383041382 ,
			txt_street: undefined,
			radius:100, //in meters
			type:'location'
		},
		//Overriding the set function in order to round the radius.
		set: function(key, value, options) {
		    if (_.isObject(key) || key == null) {
		        attrs = key;
		        options = value;
		    } else {
		        attrs = {};
		        attrs[key] = value;
		    }

		    if (!_.isUndefined(attrs.radius)) {
		    	attrs.radius = Math.round(attrs.radius);
		    }

		    return Link.prototype.set.call(this, attrs, options);
		},
		get_link_view_properties_to_listen: function() {
			return ['lat','radius'];
		},
		get_label:function(){ 
			var label = Link.prototype.get_label.apply(this,['txt_street']);
			return label;
		},
		initialize:function(options){
			Link.prototype.initialize.apply(this, [options]);
//			this.listenTo(this,"change:radius", this.round_radius);
		},
		round_radius:function() {
			var current = this.get('radius');
			this.set({radius:Math.round(current)},{silent:true});
		}
	});
	_.extend(LinkLocation.prototype.defaults, Link.prototype.defaults);
	globals.LinkLocation = LinkLocation;
	return LinkLocation;

});

