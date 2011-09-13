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
    		
    startSSE(res);

    pollCPU(res, id);

		setInterval(function(){
			pollCPU(res, id)
		}, 2000);
	}

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

  function pollCPU(res, id){
    var exec = require('child_process').exec;
    exec('sar -u 1 1 | grep Average',
      function (error, stdout, stderr) {
        if(stdout !== null){
          constructSSE(res, id, stdout)
        }
        if(error !== null) {
          console.log('exec error: ' + error);
          res.end();
        }
    });
  }
}