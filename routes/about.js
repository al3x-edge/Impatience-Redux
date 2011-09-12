// All routes for '/about'
module.exports = function(app){
	app.get('/about', function(req, res){
	  res.render('about', {
	    title: 'About'
	  });
	});
}