var app = app || {};

var consts = consts || {};
$(function() {
	app.timeoutId = 0;
	app.pageCount = 0;
	consts.LABEL_LENGTH = 15;
	consts.ENTER_KEY_CODE = 13;
	consts.LENGTH_DIAGRAM_TITLE = 18;
	consts.DEFAULT_LOCATION_RADIUS = 50;
	app.Attributes ={
			'static': {
				model: {
					page_prototype: app.QuestPageStatic
				},
				
				view:{
					avatar : 'img/document_scroll.png',
					fill: '#99FF99',
					type_title:'Static Page',
					properties_template:'#tmpl_page_static',
					properties_prototype: app.QuestPageStaticPropertiesView
				}
				
			},
			'location': {
				model: {
					page_prototype: app.QuestPageLocation
				},
				
				view:{
					avatar : 'img/location_icon.png',
					fill: '#BDDFFF',
					type_title:'Location Page',
					properties_template:'#tmpl_page_location',
					properties_prototype: app.QuestPageLocationPropertiesView
				}
				
			},
			
			'stall': {
				model: {
					page_prototype: app.QuestPageStall

				},
				
				view:{
					avatar : 'img/stall_icon.png',
					fill: '#FFFF99',
					type_title:'Stall Page',
					properties_template:'#tmpl_page_stall',
					properties_prototype: app.QuestPageStallPropertiesView
				}
				
			},
			'question': {
				model: {
					page_prototype: app.QuestPageQuestion
				},
				
				view:{
					avatar : 'img/question_icon.png',
					fill: '#FFCCCC',
					type_title:"Question page",
					properties_template:'#tmpl_page_question',
					properties_prototype: app.QuestPageQuestionPropertiesView
				}
				
			},
			
			'surprise': {
				model: {
					page_prototype: app.QuestPageSurprise
				},
				
				view:{
					avatar : 'img/location_icon.png',
					fill: '#E5E5E5',
					type_title:"Surprise page",
					properties_template:'#tmpl_page_surprise',
					properties_prototype: app.QuestPageSurprisePropertiesView
				}
				
			},
			
			
			
			
	}
	
	// Kick things off by creating the **App**.
	new app.AppView().render();
});