Te.suite('Local Storage')(function(){
    var plainStorage = new Argon.Storage.Local();
    
    this.describe('post')(function(){
        this.specify('calling with no data')(function(){
            plainStorage.post(null);
            this.completed();
        });
        
        this.specify('calling with invalid data')(function(){
            plainStorage.post(null);
            plainStorage.post(undefined);
            this.completed();
        });
        
        this.specify('calling with data')(function(){
            plainStorage.post({data : ''});
            this.completed();
        });
        
        this.specify('calling without callback')(function(){
            plainStorage.post({data:''});
            this.completed();
        });
        
        this.specify('calling with callback')(function(spec){
            plainStorage.post({data : 1}, function(){
               spec.completed();
            });
        });
        
    });
    
    this.describe('get')(function(){
        
        this.specify('calling without callback')(function(){
            plainStorage.get({});
            this.completed();
        });
        
        this.specify('calling with callback')(function(spec){
            plainStorage.get({}, function(){
               spec.completed();
            });
        });
        
    });
    
    this.describe('put')(function(){
        this.specify('calling with no data')(function(){
            plainStorage.put(null);
            this.completed();
        });
        
        this.specify('calling with invalid data')(function(){
            plainStorage.put(undefined);
            this.completed();
        });
        
        this.specify('calling with data')(function(){
            plainStorage.put({data : ''});
            this.completed();
        });
        
        this.specify('calling without callback')(function(){
            plainStorage.put({data : ''});
            this.completed();
        });
        
        this.specify('calling with callback')(function(spec){
            plainStorage.put({data : 1}, function(){
               spec.completed();
            });
        });
    });
    
    this.describe('remove')(function(){
        this.specify('calling without callback')(function(){
            plainStorage.remove({});
            this.completed();
        });
        
        this.specify('calling with callback')(function(spec){
            plainStorage.remove({}, function(){
               spec.completed();
            });
        });
    });
});
