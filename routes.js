module.exports = function(app) {


	app.get('/api/oneregister', function(req, res) {

	    //console.log(req);
	    var text = '';
	    var options = {
	        host : 'localhost',
	        port : 3001,
	        path : '/oneregister',
	        method : 'GET',
	        headers: {
	            'MyToken': 'perrogato'
	        }
	    };

	    var call = http.request(options, function(resp) {
	       console.log("statusCode: ", res.statusCode);
	        resp.on('data', function(d) {
	            res.send(d);
	          // console.log(res);
	        });
	    });

	    call.end();
	    call.on('error', function(e) {
	        text = "error";
	    }); 

	});

	app.get('/register', function(req, res, next) {
	    var url = require('url');
	    var url_parts = url.parse(req.url, true);
	    var query = url_parts.query;
	    
	    var stringfy = querystring.stringify(req.body);
	    var options = {
	        host : 'localhost',
	        port : 3001,
	        path : '/register/'+ query.key,
	        method : 'GET',
	        headers: {
	            'MyToken': 'perrogato',
	            'Content-Type': 'application/x-www-form-urlencoded',
	            'Content-Length': stringfy.length
	        }
	    };

	    var call = http.request(options, (resp) => {
	      resp.setEncoding('utf8');
	      resp.on('data', function (chunk) {
	            var json = JSON.parse(chunk);
	            if (json.status == 'waiting'){
	                
	                res.sendFile(__dirname + '/public/register.html');
	            }
	            else
	                res.sendFile(__dirname + '/public/404.html');        
	      });
	      resp.on('end', function() {
	            //res.send(query.key);
	            //console.log('No more data in response.')
	      })
	    });

	    call.on('error', function(e) {
	        text = "error";
	    }); 

	    call.write(stringfy);
	    call.end();    
	});

	app.post('/api/register', function(req, res) {


	    var stringfy = querystring.stringify(req.body);
	    var options = {
	        host : 'localhost',
	        port : 3001,
	        path : '/register',
	        method : 'POST',
	        headers: {
	            'MyToken': 'perrogato',
	            'Content-Type': 'application/x-www-form-urlencoded',
	            'Content-Length': stringfy.length
	        }
	    };

	    var call = http.request(options, (resp) => {
	      //console.log(`STATUS: ${res.statusCode}`);
	      //console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
	      resp.setEncoding('utf8');
	      resp.on('data', (chunk) => {
	       // console.log(`BODY: ${chunk}`);
	        res.send(chunk);

	      });
	      resp.on('end', () => {
	        //console.log('No more data in response.')

	      })
	    });

	    call.on('error', function(e) {
	        text = "error";
	    }); 

	    call.write(stringfy);
	    call.end();
	    

	});

	app.post('/api/user', function(req, res) {



	    var stringfy = querystring.stringify(req.body);
	    var options = {
	        host : 'localhost',
	        port : 3001,
	        path : '/user',
	        method : 'POST',
	        headers: {
	            'MyToken': 'perrogato',
	            'Content-Type': 'application/x-www-form-urlencoded',
	            'Content-Length': stringfy.length
	        }
	    };

	    var call = http.request(options, (resp) => {
	      //console.log(`STATUS: ${res.statusCode}`);
	      //console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
	      resp.setEncoding('utf8');
	      resp.on('data', (chunk) => {
	       // console.log(`BODY: ${chunk}`);
	        res.send(chunk);

	      });
	      resp.on('end', () => {
	        //console.log('No more data in response.')

	      })
	    });

	    call.on('error', function(e) {
	        text = "error";
	    }); 

	    call.write(stringfy);
	    call.end();
	    

	});

	app.post('/api/provider', function(req, res) {



	    var stringfy = querystring.stringify(req.body);
	    var options = {
	        host : 'localhost',
	        port : 3001,
	        path : '/provider',
	        method : 'POST',
	        headers: {
	            'MyToken': 'perrogato',
	            'Content-Type': 'application/x-www-form-urlencoded',
	            'Content-Length': stringfy.length
	        }
	    };

	    var call = http.request(options, (resp) => {
	      //console.log(`STATUS: ${res.statusCode}`);
	      //console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
	      resp.setEncoding('utf8');
	      resp.on('data', (chunk) => {
	       // console.log(`BODY: ${chunk}`);
	        res.send(chunk);

	      });
	      resp.on('end', () => {
	        //console.log('No more data in response.')

	      })
	    });

	    call.on('error', function(e) {
	        text = "error";
	    }); 

	    call.write(stringfy);
	    call.end();
	    
	});

	app.put('/api/register/:id', function(req, res) {

	    console.log("req" + req.params.id);
	    //console.log(req);

	    var stringfy = querystring.stringify(req.body);
	    var options = {
	        host : 'localhost',
	        port : 3001,
	        path : '/register/' + req.params.id,
	        method : 'PUT',
	        headers: {
	            'MyToken': 'perrogato',
	            'Content-Type': 'application/x-www-form-urlencoded',
	            'Content-Length': stringfy.length
	        }
	    };

	    var call = http.request(options, (resp) => {

	      resp.setEncoding('utf8');
	      resp.on('data', (chunk) => {
	        //console.log(`BODY: ${chunk}`);
	        res.send(chunk);

	      });
	      resp.on('end', () => {
	        //console.log('No more data in response.')

	      })
	    });

	    call.on('error', function(e) {
	        text = "error";
	    }); 

	    call.write(stringfy);

	    call.end();


});
}
