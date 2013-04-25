define(['Backbone'],function(Backbone) {
	var Hint = Backbone.RelationalModel.extend({
		sync:function() {
			return false; //don't sync a hint separately...
		},
		idAttribute: "_id",
		defaults: {
			hint_title:'',
			hint_txt:''
		}
	});
	return Hint;
});
