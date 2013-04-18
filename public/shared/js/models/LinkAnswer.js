define(['models/Link'],function(Link){
	var LinkAnswer = Link.extend({
		
		defaults: {
			answer_txt:'',
			type:'answer'
		},
		get_label:function() {
			var label = Link.prototype.get_label.apply(this,['answer_txt']);
			return label;
		}
	});
	_.extend(LinkAnswer.prototype.defaults, Link.prototype.defaults);
	return LinkAnswer;
});
	
