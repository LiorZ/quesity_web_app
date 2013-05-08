define(['models/Link','models/globals'],function(Link,globals){
	var LinkAnswer = Link.extend({
		
		defaults: {
			answer_txt:undefined,
			type:'answer'
		},
		get_label:function() {
			var label = Link.prototype.get_label.apply(this,['answer_txt']);
			return label;
		},
		get_label_attr:function() {
			return 'answer_txt';
		},
	});
	_.extend(LinkAnswer.prototype.defaults, Link.prototype.defaults);
	globals.LinkAnswer = LinkAnswer;
	return LinkAnswer;
});
	
