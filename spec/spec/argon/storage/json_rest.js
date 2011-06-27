Te.suite('Json Rest Storage')(function(){
    var storage = new Argon.Storage.JsonRest({
        url : {
            post   : '/spec/array_post.js',
            get    : '/spec/array.js',
            put    : '/spec/array.js',
            remove : '/spec/array.js'
        }
    });
    
    this.describe('post')(function(){
        this.specify('test request chain')(function(spec){
            var spy = this.spy().on(Argon.Storage.JsonRest).method("_sendRequest");
            var spy2 = this.spy().on(Argon.Storage.JsonRest).method("_processComplete");
            storage.post({}, function(){
                spec.assert(spy).toBeCalled();
                spec.assert(spy2).toBeCalled();
                spec.completed();
            });
        });
        
        this.specify('calling with no data')(function(spec){
            storage.post();
            spec.completed();
        });
        
        this.specify('calling with invalid data')();
        
        this.specify('calling with data')();
        
        this.specify('calling without callback')();
        
        this.specify('calling with callback')();
        
    });
    
    this.describe('get')(function(){
        
        this.specify('test request chain')(function(spec){
            var spy = this.spy().on(Argon.Storage.JsonRest).method("_sendRequest");
            var spy2 = this.spy().on(Argon.Storage.JsonRest).method("_processComplete");
            storage.get({}, function(){
                spec.assert(spy).toBeCalled();
                spec.assert(spy2).toBeCalled();
                spec.completed();
            });
        });
        
        this.specify('calling with callback')(function(spec){
            storage.get({}, function(data){
                spec.assert(data).toBeDefined();
                spec.completed();
            });
        });
        
    });
    
    this.describe('put')(function(){
        this.specify('calling with no data')();
        
        this.specify('calling with invalid data')();
        
        this.specify('calling with data')();
        
        this.specify('calling without callback')();
        
        this.specify('calling with callback')();
    });
    
    this.describe('remove')(function(){
        this.specify('calling without callback')();
        
        this.specify('calling with callback')();
    });
});