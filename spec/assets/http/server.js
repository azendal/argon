var http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs"),
    server = http.createServer();

var app = {
    '/' : {
        'GET' : function(req, res){
            var content = {data : 'hi im just the root do something else please'};
            respondWith(res, JSON.stringify(content));
        }
    },
    
    '/spec/array.js' : {
        'GET' : function(req, res) {
            var content = [1,2,3,4,5,6];
            respondWith(res, JSON.stringify(content));
        },
        
        'POST' : function(req, res) {
            var data = "";

            req.on("data", function(chunk) {
                data += chunk;
            });

            req.on("end", function() {
                util.log("raw: " + data);

                var json = qs.parse(data);

                util.log("json: " + json);
                
                var content = [1,2,3,4,5,6];
                respondWith(res, JSON.stringify(content));
                
            });
        },
        
        'PUT' : function(req, res) {
            var content = [1,2,3,4,5,6];
            respondWith(res, JSON.stringify(content));
        },
        
        'DELETE' : function(req, res) {
            var content = [1,2,3,4,5,6];
            respondWith(res, JSON.stringify(content));
        }
    }
};

var processRequest = function(req, res) {
    console.log('\n');
    console.log('request recieved:');
    console.log('--------------------------------------');
    console.log(new Date());
    console.log('request headers', req.headers);
    console.log('requested url', req.url);
    console.log('request method', req.method);
    console.log('--------------------------------------');
    
    var uri      = url.parse(req.url).pathname, 
        filename = path.join(process.cwd(), uri);

    path.exists(filename, function(exists) {
        if(!exists) {
            
            if(app[req.url] && app[req.url][req.method]){
                app[req.url][req.method](req, res);
                return;
            }
            
            res.writeHead(404, {"Content-Type": "text/plain"});
            res.write("404 Not Found\n");
            res.end();
            return;
        }

        if (fs.statSync(filename).isDirectory()) {
            filename += '/index.html';
        }

        fs.readFile(filename, "binary", function(err, file) {
            if(err) {
                res.writeHead(500, {"Content-Type": "text/plain"});
                res.write(err + "\n");
                res.end();
                return;
            }

            res.writeHead(200);
            res.write(file, "binary");
            res.end();
        });
    });
};

var respondWith = function(res, content){
    res.writeHead(200, {'Content-Type': 'text/javascript'});
    res.write(content);
    
    console.log('--------------------------------------')
    console.log(res._header)
    console.log(content);
    
    res.end();
};

server.on('request', processRequest);
server.listen(4000);

console.log('Server running on port:4000');
console.log('waiting...');