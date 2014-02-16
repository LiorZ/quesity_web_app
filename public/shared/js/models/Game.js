define(['Backbone','models/Quest','models/api','models/globals'],function(Backbone,Quest,api,globals) {
	
	var GameModel = Backbone.RelationalModel.extend({
		idAttribute:"_id",
		relations: [{
			type: Backbone.HasOne,
			key: 'quest',
			keyDestination: 'quest_id',
			relatedModel: Quest,
			includeInJSON: "_id"
		},
		{
			type: Backbone.HasOne,
			key:'current_page',
			relatedModel:'QuestPage',
			includeInJSON:"_id"
		}],
		set_quest:function(q) {
			this.set('quest',q);
			this.set('remaining_hints',q.get('allowed_hints'));
			var pages = q.get('pages');
			var first_page = pages.findWhere({is_first:true});
			this.set('current_page',first_page);
			
		},
		defaults:{
			remaining_hints:0,
		},
		
		is_over:false,
		url:function() {
			var quest = this.get('quest');
			if (_.isUndefined(quest) || _.isNull(quest)){
				return undefined;
			} 
			var quest_id = quest.id;
			if (_.isUndefined(quest_id) || _.isNull(quest_id)) {
				return undefined;
			}
			var url = api.new_game(quest_id);
			return url;
		},
		get_first_page: function(){
			var quest = this.get('quest');
			if (_.isUndefined(quest) || _.isNull(quest)){
				return undefined;
			} 
			var pages = quest.get('pages');
			if (_.isUndefined(pages) || _.isNull(pages)){
				return undefined;
			} 
			var first_page = pages.findWhere({is_first:true});
			this.set('current_page',first_page);
			return first_page;
		},
		get_next_page: function(answer) {
			var current_page = this.get('current_page');
			if ( current_page === undefined || current_page === null )
				return undefined;
			
			var links = current_page.get('links');
			if ( links.size() === 0 ){
				this.is_over = true;
				this.trigger("game:end");
				return "END";
			}
			next_page = current_page.get_next_page(answer);
			if ( !_.isUndefined(next_page) && !_.isNull(next_page) ) {
				this.set('current_page', next_page);
				this.trigger("game:next_page:after",next_page);
			}else {
				var page = this.get('current_page');
				this.trigger("game:wrong_answer:"+page.get('page_type'), answer);
			}
			return next_page;
		},
		
		is_game_over:function() {
			return this.is_over;
		},
		
		invoke_next_page:function() {
			var page = this.get('current_page');
			this.trigger("game:next_page:" + page.get('page_type'),page);
		},
		
		use_hint: function(hint) {
			if ( this.get('remaining_hints') === 0 )
				return;
			
			hint.set('is_used',true,{silent:true});
			var cur_num_hints = this.get('remaining_hints');
			this.set('remaining_hints',Math.max(cur_num_hints-1,0));
		},
		
		hints_in_page: function() {
			var page = this.get('current_page');
			if ( !page )
				return null;
			
			return page.get('hints');
		},
		get_current_page: function() {
			return this.get('current_page');
		}
	});
	
	return GameModel;
	
});