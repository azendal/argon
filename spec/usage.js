Te.suite('Argon Usage')(function() {
    
    this.specify("Model declaration")(function(spec) {
        
        var Scope = {};
        
        Class(Scope, 'User').includes(Argon.Model)({
            storage : (new Argon.Storage.Local()),
            
        });
        
        Scope.User.create({username:'fernando', password:'123456'}, function(user){
            spec.assert(user.errors.length).toEqual(0);
            spec.assert(user.username).toEqual('fernando');
            spec.assert(user.password).toEqual('123456');
            console.log(user);
            spec.completed();
        });
        
        
    });

});