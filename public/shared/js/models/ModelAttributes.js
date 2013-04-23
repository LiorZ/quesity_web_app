define(['models/QuestPageStatic','models/QuestPageLocation','models/QuestPageStall','models/QuestPageQuestion','models/QuestPageSurprise'],
        function(QuestPageStatic,QuestPageLocation,QuestPageStall,QuestPageQuestion,QuestPageSurprise) {
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
			}
	}
	
	return Attributes;
});