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
            var content = [1,2,3,4,5,6];
            respondWith(res, JSON.stringify(content));
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
    
    
    app[req.url][req.method](req, res);
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