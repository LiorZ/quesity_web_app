module.exports = function(passport) {
	var auth_user = function (req, res, next) {
		  if (req.isAuthenticated()) { return next(); }
		  res.redirect('/');
	}
	return {
		auth_user: auth_user
	}
}