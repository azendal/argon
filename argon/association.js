Module(Argon, 'Association')({
    hasOne  : function () {
        var association;
        for (var i=0; i < arguments.length; i++) {
            association = {
                type           : 'HAS_ONE',
                name           : arguments[i].name || arguments[i],
                cardinality    : 'one',
                targetModel    : arguments[i].targetModel || window[arguments[i]],
                localProperty  : arguments[i].localProperty || 'id',
                targetProperty : arguments[i].targetProperty || (arguments[i] + '_id')
            };
            
            this.prototype[association.name] = function(callback){
                var conditions = {};
                conditions[association.targetProperty] = this[association.localProperty];
                
                association.targetModel.read({
                    conditions : conditions
                }, function(data){
                    if (callback){
                        callback(data[0]);
                    }
                });
            };
        }
    },
    
    hasMany : function (config) {
        var association;
        association = {
            type           : 'HAS_MANY',
            name           : config.name || config,
            cardinality    : 'many',
            targetModel    : config.targetModel || window[config],
            localProperty  : config.localProperty || 'id',
            targetProperty : config.targetProperty || (config + '_id')
        };
        
        this.prototype[association.name] = function(callback){
            var conditions = {};
            conditions[association.targetProperty] = this[association.localProperty];
            
            association.targetModel.read({
                conditions : conditions
            }, 
            function(data){
                if (callback){
                    callback(data);
                }
            });
        };
    },
    
    belongsTo  : function () {
        var association;
        for (var i=0; i < arguments.length; i++) {
            association = {
                type           : 'BELONGS_TO',
                name           : arguments[i].name || arguments[i],
                cardinality    : 'one',
                targetModel    : arguments[i].targetModel || window[arguments[i]],
                targetProperty : arguments[i].targetProperty || 'id',
                localProperty  : arguments[i].localProperty || (arguments[i] + '_id')
            };
            
            this.prototype[association.name] = function(callback){
                var conditions = {};
                conditions[association.targetProperty] = this[association.localProperty];
                
                association.targetModel.read({
                    conditions : conditions
                }, function(data){
                    if (callback){
                        callback(data[0]);
                    }
                });
            };
        }
    }
});