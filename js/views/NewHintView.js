var app = app || {};
$(function() {
	
	app.NewHintView = Backbone.View.extend({
		el:'#new_hint_form',
		initialize: function() {
			
		},
		
		render:function() {
			var model = this.model;
			this.$el.dialog({
			      autoOpen: false,
			      height: 300,
			      width: 350,
			      modal: true,
			      buttons:{
			    	  OK: function(){
			    		  var hints = model.get('hints');
			    		  console.log($(txt_hint).val());
			    		  hints.add(new app.Hint({hint_txt:$(txt_hint).val(), hint_title:$(txt_hint_title).val()}));
			    		  $(txt_hint).val('');
			    		  $(txt_hint_title).val('');
			    		  $(this).dialog("close");
			    	  },
			    	  Cancel: function() {
			    		  $(this).dialog("close");
			    	  }
			    	  
			      }
			});
			this.$el.css({display: 'inline'});
			this.$el.dialog("open");
		}
		
	})}());