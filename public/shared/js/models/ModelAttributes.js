define(['models/QuestPageStatic','models/QuestPageLocation','models/QuestPageStall','models/QuestPageQuestion','models/QuestPageSurprise',
        'models/QuestPageOpenQuestion'],
        function(QuestPageStatic,QuestPageLocation,QuestPageStall,QuestPageQuestion,QuestPageSurprise,QuestPageOpenQuestion) {
	var Attributes  = {
			'static': {
				model: {
					page_prototype: QuestPageStatic
				}
				
			},
			'location': {
				model: {
					page_prototype: QuestPageLocation
				}			
			},
			
			'stall': {
				model: {
					page_prototype: QuestPageStall

				}	
			},
			'question': {
				model: {
					page_prototype: QuestPageQuestion
				}
			},
			
			'surprise': {
				model: {
					page_prototype: QuestPageSurprise
				}
			},
			open_question: {
				model: {
					page_prototype: QuestPageOpenQuestion
				}
			}
	};
	
	return Attributes;
});