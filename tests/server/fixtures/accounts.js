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

module.exports.Account = 
	{
	 account_1: {
		email: 'test1d@test.com',
		password:'abcd',
		name: {
			first:'First',
			last:'User'
		}	 
	 },
	 account_2: {
		 email: 'test2@test.com',
			password:'abcd',
			name: {
				first:'First',
				last:'User'
			} 
	 }
               
};


module.exports.Quest = {
		
		quest_1: {
			title: "Quest_1",
			accountId: module.exports.Account.account_1._id,
			is_published:true
		},

		quest_2:{
			title: "Quest_2",
			accountId: module.exports.Account.account_1._id,
			is_published:false
		}
		
}