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
		var spawn = require('child_process').spawn,
        exec = require('child_process').exec;
		var args = ['-u','1','1'];
		
    startSSE(res);

		var child = exec('sar -u 1 1 | grep Average',
      function (error, stdout, stderr) {
        if(stdout !== null){
          constructSSE(res, id, stdout)
        }
        if(error !== null) {
          console.log('exec error: ' + error);
        }
    });

		setInterval(function(){
			var child = exec('sar -u 1 1 | grep Average',
        function (error, stdout, stderr) {
          if(stdout !== null){
            constructSSE(res, id, stdout)
          }
          if(error !== null) {
            console.log('exec error: ' + error);
          }
      });
		}, 2000);
	}

	function constructSSE(res, id, data){
	  res.write('id: ' + id + '\n');
	  res.write("data: " + data + '\n\n');
	}

  function startSSE(res){
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });
  }
}