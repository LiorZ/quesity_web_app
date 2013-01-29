var app = app || {};
$(function() {
	app.timeoutId = 0;
	app.pageCount = 0;
	app.Attributes ={
			'static': {
				model: {
					
				},
				
				view:{
					avatar : 'img/document_scroll.png',
					fill: '#99FF99',
					type_title:'Static Page'
				}
				
			},
			'location': {
				model: {
					
				},
				
				view:{
					avatar : 'img/location_icon.png',
					fill: '#BDDFFF',
					type_title:'Location Page'
				}
				
			},
			
			'stall': {
				model: {
					
				},
				
				view:{
					avatar : 'img/stall_icon.png',
					fill: '#FFFF99',
					type_title:'Stall Page'
				}
				
			},
			'question': {
				model: {
					
				},
				
				view:{
					avatar : 'img/question_icon.png',
					fill: '#FFCCCC',
					type_title:"Question page"
				}
				
			},
			
			'surprise': {
				model: {
					
				},
				
				view:{
					avatar : 'img/location_icon.png',
					fill: '#E5E5E5',
					type_title:"Surprise page"
				}
				
			},
			
			
			
			
	}
	
	// Kick things off by creating the **App**.
	new app.AppView().render();
	
	
});