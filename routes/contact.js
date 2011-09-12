// All routes for '/contact'
module.exports = function(app){
	app.get('/contact', function(req, res){
	  res.render('contact', {
	    title: 'Contact'
	  });
	});
}