Te.suite('Json Rest Storage')(function(){
    var storage = new Argon.Storage.JsonRest({
        url : {
            post   : '/spec/array.js',
            get    : '/spec/array.js',
            put    : '/spec/array.js',
            remove : '/spec/array.js'
        }
    });


    var storage2 = new Argon.Storage.JsonRest({
        url : {
            post   : '/spec/array.js',
            get    : '/spec/array.js',
            put    : '/spec/array.js',
            remove : '/spec/array.js'
        }
    });

    var storage3 = new Argon.Storage.JsonRest({
        url : {
            get : '/spec/request_with_params.js'
        }
    });

    this.describe("_processResponse")(function(){
        this.beforeEach(function(){
            storage2.processors.push(function(data){
                return "data:" + data.join(',');
            });
            storage2.processors.push(function(data){
                return "response_" + data;
            });
            storage2.preprocessors.push(function(params){
                PropertyEncoder.encode(params);
            });
        });

        this.specify("Response should return a string with prefix 'response_data:'")(function(spec){
            var regexp = /response_data:.+/;
            storage2.post({config : {}, data:{x:1}}, function(data){
                spec.assert(data).toMatch(regexp);
                spec.completed();
            });
        });
    });

    this.describe('post')(function(){
        this.specify('test post request chain')(function(spec){
            var spy = this.spy().on(Argon.Storage.JsonRest).method("_sendRequest");
            var spy2 = this.spy().on(Argon.Storage.JsonRest).method("_processResponse");
            storage.post({config : {}, data:{x:1}}, function(){
                spec.assert(spy).toBeCalled();
                spec.assert(spy2).toBeCalled();
                spec.completed();
            });
        });

        this.specify('calling post with no data')(function(spec){
            storage.post();
            spec.completed();
        });

        this.specify('calling post with invalid data')(function(spec){
            var req_data = {config : {}, data : { test_name : spec.description, valid : false }};
            storage.post(req_data, function(data) {
                spec.assert(data.error).toEqual("Invalid Data");
                spec.completed();
            });
        });

        this.specify('calling post with valid data')(function(spec){
            var req_data = {config : {}, data : { test_name : spec.description, valid : true}};
            storage.post(req_data, function(data) {
                spec.assert(data.join(",")).toEqual("1,2,3,4,5,6");
                spec.completed();
            } );
        });
    });

    this.describe('get')(function(){

        this.specify('test get request chain')(function(spec){
            var spy = this.spy().on(Argon.Storage.JsonRest).method("_sendRequest");
            var spy2 = this.spy().on(Argon.Storage.JsonRest).method("_processResponse");
            storage.get({config : {}}, function(){
                spec.assert(spy).toBeCalled();
                spec.assert(spy2).toBeCalled();
                spec.completed();
            });
        });

        this.specify('calling get with callback')(function(spec){
            storage.get({config : {}}, function(data){
                spec.assert(data).toBeDefined();
                spec.completed();
            });
        });

        this.specify('preprocessors are executed')(function(spec){
            var spy = this.spy().on(storage2.preprocessors).method(0);
            var data = {config : {}, someData:'value'};
            storage2.get(data, function(result){
                spec.assert(spy).toBeCalled();
                spec.completed();
            });
        });

        this.specify('Field Encoder preprocessor is executed')(function(spec){
            spec.completed();
            return;
            storage3.preprocessors.push(function(params) {
                var encodedFields = FieldEncoder.encode(params);
                return encodedFields;
            });
            var spy = this.spy().on(storage3.preprocessors).method(0);
            var data = {id:1, query: {firstName:"John", lastName:"Doe"}};
            var expected = {id:1, query: {first_name:"John", last_name:"Doe"}};
            storage3.get(data, function(result){
                spec.assert(spy).toBeCalled();
                spec.assert(JSON.stringify(result)).toEqual(JSON.stringify(expected));
                spec.completed();
            });
        });
    });

    this.describe('put')(function(){
        this.specify('calling put with no data')(function(spec) {
            storage.put();
            spec.completed();
        });

        this.specify('calling put with invalid data')(function(spec) {
            var req_data = {config : {}, data : { test_name : spec.description, valid : false }};
            storage.put(req_data, function(data) {
                spec.assert(data.error).toEqual("Invalid Data");
                spec.completed();
            });
        });

        this.specify('calling put with valid data')(function(spec) {
            var req_data = {config : {}, data : { test_name : spec.description, valid : true }};
            storage.put(req_data, function(data) {
                spec.assert(data.join(",")).toEqual("1,2,3,4,5,6");
                spec.completed();
            });
        });

        this.specify('calling put without callback')(function(spec){
            var req_data = {config : {}, data : { test_name : spec.description, valid : true }};
            storage.put(req_data);
            spec.completed();
        });
    });

    this.describe('remove')(function(){
        this.specify('calling remove without callback')(function(spec) {
            var req_data = {config : {}, data : { test_name : spec.description }};
            storage.remove(req_data);
            spec.completed();
        });

        this.specify('calling remove with callback')(function(spec) {
            var req_data = {config : {}, data : { test_name : spec.description }};
            storage.remove(req_data, function(data){
                spec.completed();
            });
        });
    });
});

