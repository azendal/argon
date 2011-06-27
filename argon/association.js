Module(Argon, 'Association')({
    hasOne  : function (config) {
        var association;
        association = {
            type           : 'HAS_ONE',
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
                    callback(data[0]);
                }
            });
        };
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
    
    belongsTo  : function (config) {
        var association;
        association = {
            type           : 'BELONGS_TO',
            name           : config.name || config,
            cardinality    : 'many',
            targetModel    : config.targetModel || window[config],
            localProperty  : config.localProperty || (config + '_id'),
            targetProperty : config.targetProperty || 'id'
        };
        
        this.prototype[association.name] = function(callback){
            var conditions = {};
            conditions[association.targetProperty] = this[association.localProperty];
            
            association.targetModel.read({
                conditions : conditions
            }, 
            function(data){
                if (callback){
                    callback(data[0]);
                }
            });
        };
    }
});