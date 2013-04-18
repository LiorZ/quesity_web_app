define([],function() {
	var Hint = Backbone.Model.extend({
		
		defaults: {
			hint_title:'',
			hint_txt:''
		}
	});
	return Hint;
});
