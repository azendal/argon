Module(Argon, 'Model').includes(CustomEventSupport, ValidationSupport)({
    
    /**
    Contains the instance of the storage adapter for the model
    This property must be set when creating the model
    @property storage <public> [Storage] (null)
    **/
    storage : null,
    
    /**
    Contains the caching data for the model
    @property _cache <private> [Object] ({})
    **/
    _cache  : {},
    
    /**
    Configures the caching expire times
    By default this are cached forever, so the possible values for this is:
    null cache forever
    Number (milliseconds) the time to live for the caching key
    @property _cacheTimeToLive <private> [Object] ({all:null,instance:null})
    **/
    _cacheTimeToLive : {
        all      : null,
        instance : null
    },
    
    /**
    Builds a new instance of Argon Model and saves to storage.
    @method create <public, static>
    @argument data <required> [Object] the attributes of the model.
    @return [Argon.Model]
    **/
    create  : function (data) {
        this.dispatch('beforeCreate');
        model = new this(data);
        model.save();
        this.dispatch('afterCreate');
        return model;
    },
    
    /**
    Builds a new instance of Argon Model from storage.
    @method read <public, static>
    @argument query <required> [Object] conditions to match.
    @argument callback <optional> [function] function to handle data.
    @return [Argon.Model]
    **/
    read    : function (query, callback) {
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

        return this;
    },
    
    /**
    Tells if the given cache key is present in the cache object.
    @method isCached <public, static>
    @argument key <required> [String] key to look for.
    @return [Boolean].
    **/
    isCached : function (key) {
        return this._cache.hasOwnProperty(key) && this._cache[key].data != 'undefined';
    },
    
    /**
    Tells if the given cache key is already expired.
    @method isCacheExpired <public, static>
    @argument key <required> [String] key to look for.
    @argument timeKey <required> [String] time key to look for.
    @return [Boolean].
    **/
    isCacheExpired : function(key, timeKey) {
        if (this._cacheTimeToLive.hasOwnProperty(timeKey)) {
            return this._cacheTimeToLive[timeKey] !== null && ((new Date() - this._cache[key].cachedAt) > this._cacheTimeToLive[timeKey]);
        }
        return false;
    },
    
    /**
    Fetches all records of a given Model and creates the instances.
    @method all <public, static>
    @argument callback <optional> [Function] method to handle data.
    @return [Argon.Model].
    **/
    all : function (callback) {
        var Model, data;
        
        Model = this;
        
        if( this.isCached('all') && !this.isCacheExpired('all', 'all') ) {
            data = this._cache.all.data;
            if (callback) {
                callback.call(this, data);
            }
            this.dispatch('afterRead');
        } else {
            this.read({}, function (data) {
                if (callback) {
                    callback.call(Model, data);
                }
                Model._cache.all = {
                    cachedAt : (new Date()),
                    data     : data
                };
                Model.dispatch('afterRead');
            });
        }
        
        return this;
    },
    
    /**
    Fetches one record of a given Model and creates the instance.
    @method find <public, static>
    @argument id <required> [Object] the id of the record.
    @argument callback <optional> [Function] method to handle data.
    @return [Argon.Model].
    **/
    find : function (id, callback) {
        var key = 'find_' + id.toString();
        if (this.isCached(key) && !this.isCacheExpired(key,'instance')) {
            data = this._cache[key].data;
            if (callback) {
                callback.call(this, data);
            }
        } else {
            var that = this;
            this.read({conditions : {id : id}}, function (data) {
                if (callback) {
                    callback.call(that, data);
                }
                that._cache[key] = { data : data, cachedAt : (new Date())};
            });
        }
        return this;
    },
    
    /**
    Fetches one record of a given Model and creates the instance.
    @method findBy <public, static>
    @argument attribute <required> [String] the attribute to match.
    @argument value <required> [String] the value to match in the attribute.
    @argument callback <optional> [Function] method to handle data.
    @return [Argon.Model].
    **/
    findBy : function (attribute, value, callback) {
        var customConditions, key;
        customConditions = {};
        customConditions[attribute] = value;
        key = 'findBy_' + attribute + '_' + value;

        if (this.isCached(key) && !this.isCacheExpired(key,'instance')) {
            data = this._cache[key].data;
            if (callback) {
                callback.call(this, data);
            }
        } else {
            var that = this;
            this.read({conditions : customConditions}, function (data) {
                if (callback) {
                    callback.call(that, data);
                }
                that._cache[key] = { data : data, cachedAt : (new Date())};
            });
        }
        return this;
    },
    
    prototype : {
        errors           : [],
        init             : function (properties) {
            var property;

            this.eventListeners = [];

            for (property in properties) {
                if (properties.hasOwnProperty(property)) {
                    this[property] = properties[property];
                }
            }

            return this;
        },
        
        /**
        Exposes the value of a property.
        @method getProperty <public>
        @argument property <required> [String] the property to expose.
        @return [Object] the property value.
        **/
        getProperty      : function (property) {
          return this[property];
        },
        
        /**
        Sets the value of a property.
        @method setProperty <public>
        @argument property <required> [String] the property to write.
        @argument newValue <required> [String] the value for the property.
        @return [Object] instance of the model.
        **/
        setProperty      : function (property, newValue) {
            var originalValue;

            if (newValue != originalValue) {
                originalValue = this[property];
                this[property] = newValue;

                this.dispatch('change:' + property, {
                    originalValue : originalValue,
                    newValue      : newValue
                });
            }

            return this;
        },
        
        /**
        Sets the value of a group of properties.
        @method updateProperties <public>
        @argument properties <required> [Object] the properties collection to write.
        @return [Object] instance of the model.
        **/
        updateProperties : function (properties) {
            var property;

            for (property in properties) {
                if (properties.hasOwnProperty(property)) {
                    this.setProperty(property, properties[property]);
                }
            }

            return this;
        },
        
        /**
        Saves the model to storage.
        @method save <public>
        @argument callback <required> [Function] function to manage response.
        @return Noting.
        **/
        save             : function (callback) {
            var model;

            model = this;

            this.dispatch('beforeSave');
            if (!this.isValid()) {
                return model;
            }

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
        
        /**
        Removes a record from storage.
        @method destroy <public>
        @argument callback [Function] function to manage response.
        @return Noting.
        **/
        destroy          : function (callback) {
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

