define(['shared_views/ViewAttributes','views/QuestPageStaticPropertiesView','views/QuestPageLocationPropertiesView','views/QuestPageStallPropertiesView',
        'views/QuestPageQuestionPropertiesView','views/QuestPageQuestionPropertiesView','views/QuestPageSurprisePropertiesView'],
        function(SharedViews,QuestPageStaticPropertiesView,QuestPageLocationPropertiesView,QuestPageStallPropertiesView,QuestPageQuestionPropertiesView,QuestPageQuestionPropertiesView,QuestPageSurprisePropertiesView) {
	
	var Attributes = {
			'static': {
				view: _.extend(SharedViews['static'].view,{
					properties_template:'#tmpl_page_static',
					properties_prototype: QuestPageStaticPropertiesView
				})
			},
			'location': {			
				view:_.extend(SharedViews['location'].view,{
					properties_template:'#tmpl_page_location',
					properties_prototype: QuestPageLocationPropertiesView
				})
			},
			'stall': {

				view:_.extend(SharedViews['stall'].view,{
					properties_template:'#tmpl_page_stall',
					properties_prototype: QuestPageStallPropertiesView
					
				})
				
			},
			'question': {
				
				view:_.extend(SharedViews['question'].view,{
					properties_template:'#tmpl_page_question',
					properties_prototype: QuestPageQuestionPropertiesView
				})
				
			},
			
			'surprise': {
				view:_.extend(SharedViews['surprise'].view,{
					properties_template:'#tmpl_page_surprise',
					properties_prototype: QuestPageSurprisePropertiesView
				})
			},
			'open_question': {
				view:_.extend(SharedViews['open_question'].view,{
					properties_template:'#tmpl_page_question',
					properties_prototype: QuestPageQuestionPropertiesView
				})
			},
			
			
	}
	
	return Attributes;
});