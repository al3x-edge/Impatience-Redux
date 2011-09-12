module.exports = function(app){
	app.get('/cpu', function(req, res){
	  res.render('cpu', {
	    title: 'CPU Stats'
	  });
	});
	
	app.get('/cpuStats',function(req,res){
		sendCPU(req,res);
	});
	
	function sendCPU(req, res){
		var id = (new Date()).toLocaleTimeString();
		var exec = require('child_process').exec, child;
		var c = exec('sar -u 1 1 | grep Average');
		
		setInterval(function(){
			c = exec('sar -u 1 1 | grep Average');
		}, 2000)
		
		c.stdout.on('data',function(data){
			constructSSE(res, id, data);
		});
	}

	function constructSSE(res, id, data){
		res.writeHead(200, {
	    'Content-Type': 'text/event-stream',
	    'Cache-Control': 'no-cache',
	    'Connection': 'keep-alive'
	  });
		
	  res.write('id: ' + id + '\n');
	  res.write("data: " + data + '\n\n');
	}
}