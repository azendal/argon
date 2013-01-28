Te.suite('Local Storage')(function(){
    var plainStorage = new Argon.Storage.Local();
    
    this.describe('create')(function(){
        this.specify('calling with no data')(function(){
            plainStorage.create(null);
            this.completed();
        });
        
        this.specify('calling with invalid data')(function(){
            plainStorage.create(null);
            plainStorage.create(undefined);
            this.completed();
        });
        
        this.specify('calling with data')(function(){
            plainStorage.create({data : ''});
            this.completed();
        });
        
        this.specify('calling without callback')(function(){
            plainStorage.create({data:''});
            this.completed();
        });
        
        this.specify('calling with callback')(function(spec){
            plainStorage.create({data : 1}, function(){
               spec.completed();
            });
        });
        
    });
    
    this.describe('get')(function(){
        
        this.specify('calling without callback')(function(){
            plainStorage.find({});
            this.completed();
        });
        
        this.specify('calling with callback')(function(spec){
            plainStorage.find({}, function(){
               spec.completed();
            });
        });
        
    });
    
    this.describe('put')(function(){
        this.specify('calling with no data')(function(){
            plainStorage.update(null);
            this.completed();
        });
        
        this.specify('calling with invalid data')(function(){
            plainStorage.update(undefined);
            this.completed();
        });
        
        this.specify('calling with data')(function(){
            plainStorage.update({data : ''});
            this.completed();
        });
        
        this.specify('calling without callback')(function(){
            plainStorage.update({data : ''});
            this.completed();
        });
        
        this.specify('calling with callback')(function(spec){
            plainStorage.update({data : 1}, function(){
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
