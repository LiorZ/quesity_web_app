define(['models/globals','models/LinkLocation','models/QuestPage','models/LinkLocationCollection'],
		function(globals,LinkLocation,QuestPage,LinkLocationCollection){
	
	var QuestPageLocation = QuestPage.extend({
		initialize:function(options) {
			QuestPage.prototype.initialize.apply(this, [options]);
		},
		get_next_page: function(location) {
			// Current implementation returns the link that is the closest to the given point.
			var context = this;
			var curr_min_distance = 10000000000000000;
			var links = this.get('links');
			var link;
			links.each(function(cur_link) {
				var distance = context.calc_distance(location.lng,location.lat, cur_link.get('lng'),cur_link.get('lat'));
				if ( distance < curr_min_distance ){
					curr_min_distance = distance;
					link = cur_link;
				}
			});
			if ( _.isUndefined(link) || _.isNull(link) ) 
				return undefined;
			if ( link.get('radius') > curr_min_distance )
				return link.get('links_to_page');
			
			return undefined;
		},
		calc_distance: function(lon1_user,lat1_user,lon2_user,lat2_user){
			if (typeof(Number.prototype.toRad) === "undefined") {
				Number.prototype.toRad = function() {
					return this * Math.PI / 180;
				};
			}
			var R = 6371000; // Earth radius in meters
			var dLat_raw =(lat2_user-lat1_user); 
			var dLat = dLat_raw.toRad();
			
			var dLon_raw = (lon2_user-lon1_user); 
			var dLon = dLon_raw.toRad();
			var lat1 = lat1_user.toRad();
			var lat2 = lat2_user.toRad();

			var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
			Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
			var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
			var d = R * c;
			return d;

		}
		
	});
	globals.QuestPageLocation = QuestPageLocation;
	return QuestPageLocation;
	
});