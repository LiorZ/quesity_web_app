module.exports = function(mongoose) {
	
	var UsageCodeSchema = new mongoose.Schema({
		code: {type:String,unique: true,index:true},
		used:{type:Boolean, 'default':false}
	});
	
	var UsageCode = mongoose.model("UsageCode",UsageCodeSchema);
	
	var validate_code = function(code,callbacks) {
		
		UsageCode.findOne({code:code,used:false},function(err,found_code) {
			if (err || found_code == null || found_code == undefined) {
				callbacks.error(err);
				return;
			}
			found_code.used = true;
			found_code.save(function(saved) {
				callbacks.success(saved);
			})
			
		})
		
	}
	
	return {
		UsageCode: UsageCode,
		validate_code: validate_code
	}
	
}