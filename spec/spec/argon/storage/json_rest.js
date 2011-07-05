Te.suite('Json Rest Storage')(function(){
    var storage = new Argon.Storage.JsonRest({
        url : {
            post   : '/spec/array.js',
            get    : '/spec/array.js',
            put    : '/spec/array.js',
            remove : '/spec/array.js'
        }
    });

    this.describe('post')(function(){
        this.specify('test post request chain')(function(spec){
            var spy = this.spy().on(Argon.Storage.JsonRest).method("_sendRequest");
            var spy2 = this.spy().on(Argon.Storage.JsonRest).method("_processComplete");
            storage.post({data:{x:1}}, function(){
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
          var req_data = {data : { test_name : spec.description, valid : false }};
          storage.post(req_data, function(data) {
            spec.assert(data.error).toEqual("Invalid Data");
            spec.completed();
          });
        });

        this.specify('calling post with valid data')(function(spec){
          var req_data = {data : { test_name : spec.description, valid : true}};
          storage.post(req_data, function(data) {
            spec.assert(data.join(",")).toEqual("1,2,3,4,5,6");
            spec.completed();
          } );
        });
    });

    this.describe('get')(function(){

        this.specify('test get request chain')(function(spec){
            var spy = this.spy().on(Argon.Storage.JsonRest).method("_sendRequest");
            var spy2 = this.spy().on(Argon.Storage.JsonRest).method("_processComplete");
            storage.get({}, function(){
                spec.assert(spy).toBeCalled();
                spec.assert(spy2).toBeCalled();
                spec.completed();
            });
        });

        this.specify('calling get with callback')(function(spec){
            storage.get({}, function(data){
                spec.assert(data).toBeDefined();
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
          var req_data = {data : { test_name : spec.description, valid : false }};
          storage.put(req_data, function(data) {
            spec.assert(data.error).toEqual("Invalid Data");
            spec.completed();
          });
        });

        this.specify('calling put with valid data')(function(spec) {
          var req_data = {data : { test_name : spec.description, valid : true }};
          storage.put(req_data, function(data) {
            spec.assert(data.join(",")).toEqual("1,2,3,4,5,6");
            spec.completed();
          });
        });

        this.specify('calling put without callback')(function(spec){
          var req_data = {data : { test_name : spec.description, valid : true }};
          storage.put(req_data);
          spec.completed();
        });

    });

    this.describe('remove')(function(){
        this.specify('calling remove without callback')(function(spec) {
          var req_data = {data : { test_name : spec.description }};
          storage.remove(req_data);
          spec.completed();
        });

        this.specify('calling remove with callback')(function(spec) {
          var req_data = {data : { test_name : spec.description }};
          storage.remove(req_data, function(data){
            spec.completed();
          });
        });
    });
});

