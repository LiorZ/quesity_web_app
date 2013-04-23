define(['views/QuestPageStaticPropertiesView','views/QuestPageLocationPropertiesView','views/QuestPageStallPropertiesView',
        'views/QuestPageQuestionPropertiesView','views/QuestPageQuestionPropertiesView','views/QuestPageSurprisePropertiesView'],
        function(QuestPageStaticPropertiesView,QuestPageLocationPropertiesView,QuestPageStallPropertiesView,QuestPageQuestionPropertiesView,QuestPageQuestionPropertiesView,QuestPageSurprisePropertiesView) {
	var Attributes  = {
			'static': {
				view:{
					avatar : 'img/document_scroll.png',
					fill: '#99FF99',
					type_title:'Static Page',
					properties_template:'#tmpl_page_static',
					properties_prototype: QuestPageStaticPropertiesView
				}
				
			},
			'location': {			
				view:{
					avatar : 'img/location_icon.png',
					fill: '#BDDFFF',
					type_title:'Location Page',
					properties_template:'#tmpl_page_location',
					properties_prototype: QuestPageLocationPropertiesView
				}
			},
			
			'stall': {

				view:{
					avatar : 'img/stall_icon.png',
					fill: '#FFFF99',
					type_title:'Stall Page',
					properties_template:'#tmpl_page_stall',
					properties_prototype: QuestPageStallPropertiesView
				}
				
			},
			'question': {
				
				view:{
					avatar : 'img/question_icon.png',
					fill: '#FFCCCC',
					type_title:"Question page",
					properties_template:'#tmpl_page_question',
					properties_prototype: QuestPageQuestionPropertiesView
				}
				
			},
			
			'surprise': {
				view:{
					avatar : 'img/location_icon.png',
					fill: '#E5E5E5',
					type_title:"Surprise page",
					properties_template:'#tmpl_page_surprise',
					properties_prototype: QuestPageSurprisePropertiesView
				}
				
			}
	}
	
	return Attributes;
});