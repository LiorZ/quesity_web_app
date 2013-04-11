

//Account.js
module.exports = function(config,mongoose,nodemailer) {
	var crypto = require('crypto');

	var AccountSchema = new mongoose.Schema({
		email: { type:String, unique: true},
		password: { type:String } ,
		name: { first: {type:String}, 
			last: { type:String } },
		birthday: {
			day: {type:Number, min:1, max:31, required:false},
			month: {type:Number, min:1, max:12, required:false},
			year: {type:Number}
			
		},
		photoUrl: {type:String},
		biography:{type:String},
		tasks:[Task.schema]
	});
	
	var Account = mongoose.model('Account',AccountSchema);
	
	return {
		Account:Account
	}
}