/*
 * 	var AccountSchema = new mongoose.Schema({
		email: { type:String, unique: true},
		password: { type:String } ,
		name: { 
			first: {type:String}, 
			last: { type:String } 
		},
		date_registered:{type:Date, 'default':Date.now},
		activated:{type:Boolean, 'default':true},
		quests_playing: [{type: mongoose.Schema.ObjectId, ref:'Quest'}],
	});
 */
var ObjectId = require('mongodb').BSONNative.ObjectID;
module.exports.Account = 
	{
	 account_1: {
		email: 'test1d@test.com',
		password:'abcd',
		name: {
			first:'First',
			last:'User'
		},
		_id: new ObjectId()
	 },
	 account_2: {
		 email: 'test2@test.com',
			password:'abcd',
			name: {
				first:'First',
				last:'User'
			},
			_id: new ObjectId()
	 }
               
};


module.exports.Quest = {
		
		quest_1: {
			title: "Quest_1",
			accountId: module.exports.Account.account_1._id,
			is_published:true,
			_id: new ObjectId(),
		},

		quest_2:{
			title: "Quest_2",
			accountId: module.exports.Account.account_1._id,
			is_published:false,
			_id: new ObjectId(),
		}
		
}

module.exports.QuestPage = {};
		
module.exports.QuestPage.page_7 = {
			   "page_content": "<p>Finishing page!</p>\n<p>&nbsp;</p>",
			   "page_name": "Untitled",
			   "page_number": 7,
			   "page_type": "static",
			   "quest_id": module.exports.Quest.quest_1._id,
			   "x": 1539.0002,
			   "y": 366.0002,
			   "is_first": false,
			   "hints": [],
			   "links": [],
			   _id: new ObjectId()
};

module.exports.QuestPage.page_6 = {
					   "page_content": "<p>This is an open question page</p>\n<p>&nbsp;</p>",
					   "page_name": "Untitled",
					   "page_number": 6,
					   "page_type": "open_question",
					   "quest_id": module.exports.Quest.quest_1._id,
					   "x": 1202.0002,
					   "y": 182.00019999999995,
					   "is_first": false,
					   "hints": [],
					   "links": [
					     {
					       "links_to_page": module.exports.QuestPage.page_7._id,
					       "type": "answer",
					       "answer_txt": "ABC"
					     }
					   ],
					   _id: new ObjectId()
};
module.exports.QuestPage.page_5=  {
					   "page_content": "<p>Location page</p>\n<p>&nbsp;</p>",
					   "page_name": "Untitled",
					   "page_number": 5,
					   "page_type": "location",
					   "quest_id": module.exports.Quest.quest_1._id,
					   "x": 1214.0004,
					   "y": 529.0004,
					   "is_first": false,
					   "hints": [
					     {
					       "hint_txt": "first hint text",
					       "hint_title": "First hint"
					     },
					     {
					       "hint_txt": "second hint text",
					       "hint_title": "Second hint"
					     }
					   ],
					   "links": [
					     {
					       "links_to_page": module.exports.QuestPage.page_7._id,
					       "type": "location",
					       "radius": 131,
					       "txt_street": "Ester HaMalka 2-6, Tel Aviv, Israel",
					       "lng": 34.77455623447895,
					       "lat": 32.07904288422885
					     },
					     {
					       "links_to_page": module.exports.QuestPage.page_6._id,
					       "type": "location",
					       "radius": 180,
					       "txt_street": "He Be'Iyar 28-36, Tel Aviv, Israel",
					       "lng": 34.78983409702778,
					       "lat": 32.08664240768428
					     }
					   ],
					   _id: new ObjectId()
					 };

module.exports.QuestPage.page_4 = {
					   "page_content": "",
					   "page_name": "Untitled",
					   "page_number": 4,
					   "page_type": "static",
					   "quest_id": module.exports.Quest.quest_1._id,
					   "x": 821.0004,
					   "y": 104.00040000000001,
					   "is_first": false,
					   "hints": [],
					   "links": [
					     {
					       "links_to_page": module.exports.QuestPage.page_6._id,
					       "type": "regular"
					     }
					   ],
					   _id: new ObjectId()
};

module.exports.QuestPage.page_3 = {
							   "page_content": "<p>This is question page number 3</p>\n<p>&nbsp;</p>",
							   "page_name": "Untitled",
							   "page_number": 3,
							   "page_type": "question",
							   "quest_id": module.exports.Quest.quest_1._id,
							   "x": 791.0009999999999,
							   "y": 586.001,
							   "is_first": false,
							   "hints": [],
							   "links": [
							     {
							       "links_to_page": module.exports.QuestPage.page_5._id,
							       "type": "answer",
							       "answer_txt": "ABC"
							     }
							   ],
							   _id: new ObjectId()
};

module.exports.QuestPage.page_2 = {
							   "page_content": "<p>This the second quest page</p>\n<p>&nbsp;</p>",
							   "page_name": "Untitled",
							   "page_number": 2,
							   "page_type": "question",
							   "quest_id": module.exports.Quest.quest_1._id,
							   "x": 441.00099999999986,
							   "y": 338.00100000000003,
							   "is_first": false,
							   "hints": [
							     {
							       "hint_txt": "Hint text",
							       "hint_title": "First hint"
							     }
							   ],
							   "links": [
							     {
							       "links_to_page": module.exports.QuestPage.page_3._id,
							       "type": "answer",
							       "answer_txt": "1"
							     },
							     {
							       "links_to_page": module.exports.QuestPage.page_4._id,
							       "type": "answer",
							       "answer_txt": "2"
							     }
							   ],
							   _id: new ObjectId()
};

module.exports.QuestPage.page_1 =  {
			   "page_content": "<p>This is a static page</p>\n<p>&nbsp;</p>",
			   "page_name": "Untitled",
			   "page_number": 1,
			   "page_type": "static",
			   "quest_id": module.exports.Quest.quest_1._id, 
			   "x": 100.00060000000002,
			   "y": 318.0006,
			   "is_first": true,
			   "hints": [],
			   "links": [
			     {
			       "links_to_page": module.exports.QuestPage.page_2._id,
			       "type": "regular"
			     }
			   ],
			   _id: new ObjectId()
};		


module.exports.Quest.quest_1.pages = [module.exports.QuestPage.page_7._id,
                                      module.exports.QuestPage.page_6._id,
                                      module.exports.QuestPage.page_5._id,
                                      module.exports.QuestPage.page_4._id,
                                      module.exports.QuestPage.page_3._id,
                                      module.exports.QuestPage.page_2._id,
                                      module.exports.QuestPage.page_1._id
                                    ]
