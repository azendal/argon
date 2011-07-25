Te.suite('Argon Usage')(function() {
    
    this.specify("Model declaration")(function(spec) {
        
        var Scope = {};
        
        Class(Scope, 'User').includes(Argon.Model)({
            storage : (new Argon.Storage.Local())
        });
        
        Scope.User.create({username:'fernando', password:'123456'}, function(data){
            spec.assert(data.errors.length).toEqual(0);
            spec.assert(data.username).toEqual('fernando');
            spec.assert(data.password).toEqual('123456');
            spec.completed();
        });
    });

});