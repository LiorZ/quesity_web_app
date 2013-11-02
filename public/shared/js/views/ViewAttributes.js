define([],function() {
	var Attributes  = {
			'static': {
				view:{
					avatar : '/editor/img/document_scroll.png',
					fill: '#99FF99',
					type_title:'Static',
				}
				
			},
			'location': {			
				view:{
					avatar : '/editor/img/location_icon.png',
					fill: '#BDDFFF',
					type_title:'Location',
				}
			},
			
			'stall': {

				view:{
					avatar : '/editor/img/stall_icon.png',
					fill: '#FFFF99',
					type_title:'Stall',
				}
				
			},
			'question': {
				
				view:{
					avatar : '/editor/img/question_icon.png',
					fill: '#FFCCCC',
					type_title:"Multiple choice",
				}
				
			},
			
			'surprise': {
				view:{
					avatar : '/editor/img/location_icon.png',
					fill: '#E5E5E5',
					type_title:"Surprise",
				}
				
			},
			'open_question': {
				view:{
					avatar : '/editor/img/question_icon.png',
					fill: '#FFC400',
					type_title:"Open Question",
				}
				
			},
	}
	
	return Attributes;
});