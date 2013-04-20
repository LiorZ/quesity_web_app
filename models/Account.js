

//Account.js
module.exports = function(mongoose,Quest) {
	var crypto = require('crypto');

	var AccountSchema = new mongoose.Schema({
		email: { type:String, unique: true},
		password: { type:String } ,
		name: { first: {type:String}, 
			last: { type:String } },
		date_registered:{type:Date, 'default':Date.now},
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
	
	
	var attach_quests = function(account,succ_callback,error_callback) {
		Quest.quests_by_account(account._id,function(quests){
			console.log("Quests: ");
			if ( quests.length > 0 ){
				account.quests = quests
			}else {
				account.quests = [];
			}
			succ_callback(account);
		},error_callback);
	}
	
	
	var byId = function(id,succ_callback,err_callback) {
		
		Account.findOne({_id:id},function(err,doc){
			if (err) {
				err_callback(err);
			}else {
				var obj_account = doc.toObject();
				delete obj_account.password;
				attach_quests(obj_account,succ_callback,err_callback);
			}
		});
	};

	return {
		Account:Account,
		register:register,
		login:login,
		byId: byId,
		attach_quests: attach_quests
	}
}