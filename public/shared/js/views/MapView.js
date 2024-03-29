define(['JQueryUI_Maps','lib/utils/consts','models/globals'],function(JQueryUI_Maps,consts,globals) {
	MapView = Backbone.View.extend({
		id:'map_view',
		initialize:function(options){
			this.dialog_id = options.dialog_id || '#dialog_form';
		},
		get_proper_center_pos:function() {
            var lat = this.model.get('lat');
            var lng =  this.model.get('lng');
            
            //TODO: initialize with user current location:
            var prev_location = globals.PREV_LOCATION;
            var start_lat_lng = new google.maps.LatLng(32.077011086405825,34.76827383041382 );
            if (!_.isUndefined(prev_location)) {
            	start_lat_lng = new google.maps.LatLng(prev_location.lat, prev_location.lng);
            }
            if ( lat != undefined && lng != undefined ) {
            	start_lat_lng = new google.maps.LatLng(this.model.get('lat'), this.model.get('lng'));
            }
            return start_lat_lng;
		},
		
		render:function() {
			this.$el.css({width:'500', height:'400'});
            var context = this;
            
            var lat = this.model.get('lat');
            var lng =  this.model.get('lng');
            
            var start_lat_lng = this.get_proper_center_pos();
            var zoom = _.isUndefined(globals.PREV_LOCATION_ZOOM)?consts.MAP_VIEW_DEF_ZOOM:globals.PREV_LOCATION_ZOOM;
			this.$el.gmap({'center': start_lat_lng, 'zoom': zoom}).bind('init', function(event, map) { 
				$(map).click( function(event) {
					context.handle_click(event);
				});
				
			});

			var map = this.$el.gmap('get', 'map');
			$(map).addEventListener('zoom_changed', function(event) {
				globals.PREV_LOCATION_ZOOM = map.zoom;
			});
			
			
			if (  lat != undefined && lng != undefined && this.model.get('radius') != undefined  
					&& (this.model.get('txt_street') != undefined || this.model.get('street') != undefined) ) {
				this.create_new(this.model.get('lat'), this.model.get('lng'),this.model.get('radius'));
			}
			
			//TODO: once we work with a database , check if the object is new. if it is, don't draw this circle...
            return this.$el;
		},
		resize:function() {
			this.$el.triggerEvent('resize');
			var center_pos = this.get_proper_center_pos();
			this.$el.gmap('get','map').setOptions({'center':center_pos});
			
		},
		
		find_location: function(location) {
			var context = this;
			this.$el.gmap('search', {'location': location}, function(results, status) {
				if ( status === 'OK' ) {
					$(context.dialog_id).find('#txt_street').val(results[0].formatted_address);
					
				}
			});
		},
		create_new:function(lat,lng,radius) {
			var context = this;
			this.$el.gmap('addShape', 'Circle', { 'strokeColor': "#000000", 'strokeOpacity': 0.5, 
				'strokeWeight':2, 'fillColor': "#BDDFFF", 'fillOpacity': 0.5, 
				'center': new google.maps.LatLng(lat,lng), 
				'radius': parseInt(radius) ,draggable: true, editable: true, 'radius_changed':function(){ context.update_radius(); },
				'center_changed':function(){context.update_center(); }});
		},
		
		update_txt_fields: function(lat,lng,radius) {
			$(this.dialog_id).find('#txt_lat').val(lat);
			$(this.dialog_id).find('#txt_lng').val(lng);
			$(this.dialog_id).find('#txt_radius').val(Math.round(radius));
			
			//Keep values for display next time we open the MapView
			globals.PREV_LOCATION ={
					lat: lat,
					lng:lng
			}
		},
		
		get_circle:function() {
			var overlays = this.$el.gmap('get', 'overlays');
			if ( !overlays.Circle ){
				alert("ERROR: Can't find circle in overlays!");
				return undefined;
			}
			if ( overlays.Circle.length != 1 ){
				alert("ERROR: more than one circle!");
				return undefined;
			}
			var circle = overlays.Circle[0];
			return circle;
		},
		update_radius:function() {
			var circle = this.get_circle();
			if ( circle == undefined )
				return;
			$(this.dialog_id).find('#txt_radius').val(Math.round(circle.getRadius()));
		},
		update_center:function() {
			var circle = this.get_circle();
			if ( circle == undefined )
				return;
			var lat = parseFloat(circle.getCenter().lat());
			var lng = parseFloat(circle.getCenter().lng());
			$(this.dialog_id).find('#txt_lat').val(lat);
			$(this.dialog_id).find('#txt_lng').val(lng);
			this.find_location(new google.maps.LatLng(lat,lng));
		},
		handle_click:function(e){
			this.$el.gmap('clear', 'overlays');
			var lat = e.latLng.lat();
		    var lng = e.latLng.lng();
			this.create_new(lat,lng,consts.DEFAULT_LOCATION_RADIUS);
			this.find_location(e.latLng);
			this.update_txt_fields(lat,lng,consts.DEFAULT_LOCATION_RADIUS);
		}
	});
	
	return MapView;
});
