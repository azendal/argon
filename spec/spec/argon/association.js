Te.suite('Associations')(function(){
    this.beforeEach(function(){
        this.registry.ExampleModel = Class().includes(Argon.Model, Argon.Association)({
            storage : (new Argon.Storage.Local())
        });

        this.registry.ExampleModel.className = 'ExampleModel';
        
        this.registry.ExampleModel.storage.storage = {
            'a' : {id : 'a', data : 1},
            'b' : {id : 'b', data : 2},
            'c' : {id : 'c', data : 3},
            'd' : {id : 'd', data : 4}
        };
        
        this.registry.ExampleModel2 = Class().includes(Argon.Model, Argon.Association)({
            storage : (new Argon.Storage.Local())
        });

        this.registry.ExampleModel2.className = 'ExampleModel2';
        
        this.registry.ExampleModel2.storage.storage = {
            'e' : {id : 'e', data : 4, exampleModelId : 'a'},
            'f' : {id : 'f', data : 5, exampleModelId : 'a'},
            'g' : {id : 'g', data : 6, exampleModelId : 'b'},
            'h' : {id : 'h', data : 7, exampleModelId : 'c'}
        };
        
        this.registry.ExampleModel.hasMany({
            name           : 'model2',
            targetModel    : this.registry.ExampleModel2,
            localProperty  : 'id',
            targetProperty : 'exampleModelId'
        });
    });

    this.specify('Model includes Argon.Asociation')(function(){
        this.assert(this.registry.ExampleModel.__includedModules.indexOf(Argon.Association)).toBeGreaterThan(-1);
        this.completed();
    });
    
    this.specify('Model has the hasMany method exposed')(function(){
        this.assert(this.registry.ExampleModel.hasMany).toBeInstanceOf(Function);
        this.completed();
    });
    
    this.specify('Model has expose association name on prototype')(function(){
        this.assert(this.registry.ExampleModel.prototype.model2).toBeInstanceOf(Function);
        this.completed();
    });
    
    this.specify('Model instance association method returns the correct data')(function(spec){
        spec.registry.ExampleModel.read({}, function(data){
            var instance = new spec.registry.ExampleModel(data[0]);
            instance.model2(function(data){
                spec.assert(data.length).toBeGreaterThan(0);
                spec.assert(data[0].exampleModelId).toEqual(instance.id);
                spec.completed();
            });
        });
    });
});