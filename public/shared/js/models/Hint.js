define(['Backbone'],function(Backbone) {
	var Hint = Backbone.RelationalModel.extend({
		
		defaults: {
			hint_title:'',
			hint_txt:''
		}
	});
	return Hint;
});
