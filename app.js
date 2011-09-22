/**
 * Module dependencies.
 */

var express = require('express'),
		mongoose = require('mongoose'),
		fs = require('fs');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
	app.use(express.cookieParser());
	app.use(express.session({ secret: '1iFLjD2lLD3byyJeBp11' }));
  app.use(require('stylus').middleware({ src: __dirname + '/public' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
	mongoose.connect('mongodb://localhost/impatience_development');
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
	mongoose.connect('mongodb://localhost/impatience_production');
  app.use(express.errorHandler()); 
});

// Routes
require('./routes')(app);
require('./models')(app);

function startSSE(res){
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });
}

function constructSSE(res, id, data){
  res.write('id: ' + id + '\n');
  res.write("data: " + data + '\n\n');
}

if(!module.parent){
	app.listen(3000);
	console.log("Express server listening on port %d", app.address().port);
}