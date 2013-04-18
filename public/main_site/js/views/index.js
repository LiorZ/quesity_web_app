define(['text!../../templates/index.html'], function(indexTemplate) {
  var indexView = Backbone.View.extend({
    el: $('#content'),
    events:{
    	'click #lnk_logoff' : 'action_logoff'
    },
    render: function() {
    	var template = _.template(indexTemplate);
    	
    	this.$el.html(indexTemplate);
    },
    action_logoff:function(){
    	$.get('/logoff',function(data) { 
    		window.location.hash = 'login';
    	});
    	return false;
    },
  });
  return indexView;
});