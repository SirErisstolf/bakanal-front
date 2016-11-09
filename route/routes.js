module.exports = function(app,http,querystring,passport,multer,fs) {


	var storageProfile = multer.diskStorage({ //multers disk storage settings
        destination: function (req, file, cb) {
        	console.log(req);
            cb(null, './public/uploads/'+req.user.username+'/profile');
        },
        filename: function (req, file, cb) {
            var datetimestamp = Date.now();
            cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]);
        }
    });

	var storageGallery = multer.diskStorage({ //multers disk storage settings
        destination: function (req, file, cb) {
            cb(null, './public/uploads/'+req.user.username+'/gallery');
        },
        filename: function (req, file, cb) {
        	console.log(file);
            var datetimestamp = Date.now();

            cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]);

        }
    });

    var uploadProfile = multer({ //multer settings
                    storage: storageProfile
                }).single('file');
    var uploadGallery = multer({ //multer settings
                    storage: storageGallery
                }).single('file');

    /** API path that will upload the files */
    app.post('/uploadProfile', function(req, res) {

        uploadProfile(req,res,function(err){
            if(err){
                 res.json({error_code:1,err_desc:err});
                 return;
            }

             res.json({error_code:0,err_desc:null,filename:req.file.filename});
             
        });
    });

    /*    rmDir = function(dirPath) {
      try { var files = fs.readdirSync(dirPath); }
      catch(e) { return; }
      if (files.length > 0)
        for (var i = 0; i < files.length; i++) {
          var filePath = dirPath + '/' + files[i];
          if (fs.statSync(filePath).isFile())
            fs.unlinkSync(filePath);
          else
            rmDir(filePath);
        }
      fs.rmdirSync(dirPath);
    };
    */

    app.post('/uploadGallery', function(req, res) {
        uploadGallery(req,res,function(err){
            if(err){
                 res.json({error_code:1,err_desc:err});
                 return;
            }
            //console.log(req);
             res.json({error_code:0,err_desc:null,filename:req.file.filename});
        });
    });

    app.get('/profile', isLoggedIn, function(req, res) {
    	//console.log(req);
        res.redirect('/edit?key='+ req.user.key);
    });

    app.get('/api/logged', function(req, res) {

    	if(req.isAuthenticated()) {
        	res.send(true);	
    	}else{
        	res.send(false);	
    	}

    	
    });

    app.get('/api/folder/:id', function(req, res) {
    	console.log(req.params.id);
    	var root = './public/uploads/' + req.params.id;
        var profileImage = './public/uploads/' + req.params.id + '/profile';
        var imageFolder = './public/uploads/' + req.params.id + '/gallery';

        if (!fs.existsSync(root)){
		    fs.mkdirSync(root);
		}

		if (!fs.existsSync(profileImage)){
		    fs.mkdirSync(profileImage);
		}	

		if (!fs.existsSync(imageFolder)){
		    fs.mkdirSync(imageFolder);
		}
    });

    app.get('/login', function(req, res) {
        res.render('login.ejs');
    });

    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    app.get('/edit', isLoggedIn, function(req, res) {
        res.render('edit.ejs');
    });

    app.get('/view', function(req, res) {
        res.render('view.ejs');
    });

    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/login');
    });

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
	       //console.log("statusCode: ", res.statusCode);
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

    app.get('/edit', function(req, res) {
        res.render('edit.ejs',{
            user : 'test'
        });
    });

    app.get('/logout', function(req, res) {
        //req.logout();
        //res.redirect('/edit?key=56dae91440b4b30a21000005');
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

	    var call = http.request(options, function(resp){
	      resp.setEncoding('utf8');
	      resp.on('data', function (chunk) {
	            var json = JSON.parse(chunk);
	            if (json.status == 'waiting'){
	                
	                res.render('register.ejs');
	            }
	            else
	                res.redirect('/');        
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

	    var call = http.request(options, function (resp) {
	      //console.log(`STATUS: ${res.statusCode}`);
	      //console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
	      resp.setEncoding('utf8');
	      resp.on('data', function(chunk) {
	       // console.log(`BODY: ${chunk}`);
	        res.send(chunk);

	      });
	      resp.on('end', function()  {
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

	    var call = http.request(options, function(resp)  {
	      //console.log(`STATUS: ${res.statusCode}`);
	      //console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
	      resp.setEncoding('utf8');
	      resp.on('data', function(chunk)  {
	       // console.log(`BODY: ${chunk}`);
	        res.send(chunk);

	      });
	      resp.on('end',function () {
	        //console.log('No more data in response.')

	      })
	    });

	    call.on('error', function(e) {
	        text = "error";
	    }); 

	    call.write(stringfy);
	    call.end();
	    

	});


	app.get('/api/providers', function(req, res) {

		var text = '';
	    var options = {
	        host : 'localhost',
	        port : 3001,
	        path : '/providers',
	        method : 'GET',
	        headers: {
	        	'MyToken': 'perrogato'
	        }
	    };

	    var call = http.request(options, function(resp) {
	        //console.log("statusCode: ", res.statusCode);
	        resp.on('data', function(d) {
	            res.send(d);
	        });
	    });

	    call.end();
	    call.on('error', function(e) {
	        text = "error";
	    });	

	});

	app.get('/api/mails', function(req, res) {

		var text = '';
	    var options = {
	        host : 'localhost',
	        port : 3001,
	        path : '/mails',
	        method : 'GET',
	        headers: {
	        	'MyToken': 'perrogato'
	        }
	    };

	    var call = http.request(options, function(resp) {
	        //console.log("statusCode: ", res.statusCode);
	        resp.on('data', function(d) {
	            res.send(d);
	        });
	    });

	    call.end();
	    call.on('error', function(e) {
	        text = "error";
	    });	

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

	    var call = http.request(options, function (resp) {
	      //console.log(`STATUS: ${res.statusCode}`);
	      //console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
	      resp.setEncoding('utf8');
	      resp.on('data', function(chunk)  {
	       // console.log(`BODY: ${chunk}`);
	        res.send(chunk);

	      });
	      resp.on('end',function ()  {
	        //console.log('No more data in response.')

	      })
	    });

	    call.on('error', function(e) {
	        text = "error";
	    }); 

	    call.write(stringfy);
	    call.end();
	    
	});

	app.post('/api/stats', function(req, res) {



	    var stringfy = querystring.stringify(req.body);
	    var options = {
	        host : 'localhost',
	        port : 3001,
	        path : '/stats',
	        method : 'POST',
	        headers: {
	            'MyToken': 'perrogato',
	            'Content-Type': 'application/x-www-form-urlencoded',
	            'Content-Length': stringfy.length
	        }
	    };

	    var call = http.request(options, function (resp) {
	      //console.log(`STATUS: ${res.statusCode}`);
	      //console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
	      resp.setEncoding('utf8');
	      resp.on('data', function(chunk)  {
	       // console.log(`BODY: ${chunk}`);
	        res.send(chunk);

	      });
	      resp.on('end',function ()  {
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

	   // console.log("req" + req.params.id);
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

	    var call = http.request(options, function(resp) {

	      resp.setEncoding('utf8');
	      resp.on('data', function (chunk)  {
	        //console.log(`BODY: ${chunk}`);
	        res.send(chunk);

	      });
	      resp.on('end',function () {
	        //console.log('No more data in response.')

	      })
	    });

	    call.on('error', function(e) {
	        text = "error";
	    }); 

	    call.write(stringfy);

	    call.end();


	});

	app.get('/api/provider/:id', function(req, res) {
		//console.log("routes");

	    
	   // console.log(query);
	    var stringfy = querystring.stringify(req.body);
	    var options = {
	        host : 'localhost',
	        port : 3001,
	        path : '/provider/'+ req.params.id,
	        method : 'GET',
	        headers: {
	            'MyToken': 'perrogato',
	            'Content-Type': 'application/x-www-form-urlencoded',
	            'Content-Length': stringfy.length
	        }
	    };

	    var call = http.request(options, function(resp) {
	      resp.setEncoding('utf8');
	      resp.on('data', function (chunk) {
	            res.send(chunk);
	            /*var json = JSON.parse(chunk);
	            if (json.status == 'waiting'){
	                
	                res.render('register.ejs');
	            }
	            else
	                res.redirect('/');        */
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

app.put('/api/provider/:id', function(req, res) {

    //console.log("req" + req.params.id);
    //console.log(req);

    var stringfy = querystring.stringify(req.body);
    var options = {
        host : 'localhost',
        port : 3001,
        path : '/provider/' + req.params.id,
        method : 'PUT',
        headers: {
            'MyToken': 'perrogato',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': stringfy.length
        }
    };

    var call = http.request(options, function(resp) {

      resp.setEncoding('utf8');
      resp.on('data', function(chunk)  {
        //console.log(`BODY: ${chunk}`);
        res.send(chunk);

      });
      resp.on('end',function () {
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

function isLoggedIn(req, res, next) {
	//console.log('aut : ' + req.isAuthenticated())
    if (req.isAuthenticated()) //esto va sin negacion
        return next();

    res.redirect('/login');
}


