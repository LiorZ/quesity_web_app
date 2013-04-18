

//Account.js
module.exports = function(mongoose,nodemailer) {
	var crypto = require('crypto');

	var AccountSchema = new mongoose.Schema({
		email: { type:String, unique: true},
		password: { type:String } ,
		name: { first: {type:String}, 
			last: { type:String } },
		date_registered:{type:Date, 'default':Date.now}
	});
	
	var Account = mongoose.model('Account',AccountSchema);
	var registerCallback = function(err) {
		if (err) { 
			return console.log(err);
		}
		return true;
	};
	var register = function(email,password,firstName,lastName) { 
		var shaSum = crypto.createHash('sha256');
		shaSum.update(password);
		console.log("Registering " + email);
		
		var user = new Account({ 
			email: email,
			name: {
				first: firstName,
				last: lastName
			},
			password: shaSum.digest('hex')
		});
		
		user.save(registerCallback);
		console.log('Save command was sent');
	};
	var login = function(email,password,callback) {
		var shaSum = crypto.createHash('sha256');
		shaSum.update(password);
		Account.findOne({email:email,password:shaSum.digest('hex')}, function(err,doc) { console.log(doc); callback( doc ) });
	};
	
	
	return {
		Account:Account,
		register:register,
		login:login
	}
}