Te.suite('Argon Usage')(function() {
    
    this.specify("Model declaration")(function(spec) {
        
        var Scope = {};
        
        Class(Scope, 'User').includes(Argon.Model)({
            storage : (new Argon.Storage.Local()),
            
            validations : {
                username : {
                    validate : function (callback) {
                        if (this.hasOwnProperty('username') && this.getProperty('username').length > 0) {
                            callback();
                        } else {
                            callback('username is required');
                        }
                    }
                },
                
                password : {
                    validate : function (callback) {
                        if (this.hasOwnProperty('password') && this.getProperty('password').length > 5) {
                            callback();
                        } else {
                            callback('password is required');
                        }
                    }
                }
            }
        });
        
        var user = new Scope.User({username:'fernando', password:'123456'});
        user.save(function(user){
            user = new Scope.User(user);
            spec.assert(user.errors.length).toEqual(0);
            spec.assert(user.getProperty('username')).toEqual('fernando');
            spec.assert(user.getProperty('password')).toEqual('123456');
            
            user.bind('change:password', function(){
                console.log('password changed');
            });
            
            user.setProperty('password', '1234567');
            user.save(function(user){
                user = new Scope.User(user)
                spec.assert(user.getProperty('password')).toEqual('1234567');
                spec.completed();
            });
        });
        
        
    });

});
