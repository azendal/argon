Module(Argon, 'Model').includes(CustomEventSupport)({
    storage : null,
    
    create : function(data){
        this.dispatch('beforeCreate');
        model = new this(data);
        this.dispatch('afterCreate');
        return model;
    },
    
    read : function(query, callback) {
        var data, Model;
        query = query || {};
        
        Model = this;
        
        this.dispatch('beforeRead');
        
        query.className = this.className;
        
        this.storage.get(query, function(data){
            Model.dispatch('afterRead');
            if (callback) {
                callback(data);
            }
        });
    },
    
    prototype : {
        properties : {},
        init : function (data){
            $.extend(this, data);
        },
        save : function (callback) {
            var model;
            
            model = this;
            
            this.dispatch('beforeSave');
            
            if (this.hasOwnProperty('id') && this.id !== '') {
                this.constructor.storage.put(this, function(data){
                    model.dispatch('afterSave');
                    if (callback) {
                        callback(data);
                    }
                });
            }
            else {
                this.constructor.storage.post(this, function(data){
                    model.dispatch('afterSave');
                    if (callback) {
                        callback(data);
                    }
                });
            }
        },
        destroy : function (callback) {
            var model = this;
            this.dispatch('beforeDestroy');
            
            this.constructor.storage.remove({
                conditions : { id : this.id }
            }, function(){
                model.id = null;
                model.dispatch('afterDestroy');
                if (callback) {
                    callback(model);
                }
            });
        }
    }
});