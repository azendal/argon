Module(Argon, 'Model').includes(CustomEventSupport, ValidationSupport)({
    storage : null,
    _cache  : {},
    _cacheTimeToLive : {
        all      : null,
        instance : null,
        first    : null,
        last     : null
    },
    create  : function (data) {
        this.dispatch('beforeCreate');
        model = new this(data);
        model.save();
        this.dispatch('afterCreate');
        return model;
    },
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
    isCached : function (key) {
        return this._cache.hasOwnProperty(key) && this._cache[key].data != 'undefined';
    },
    isCacheExpired : function(key) {
        if (this._cacheTimeToLive.hasOwnProperty(key)) {
            return this._cacheTimeToLive[key] !== null && ((new Date() - this._cache[key].cachedAt) > this._cacheTimeToLive[key]);
        }
        return false;
    },
    all : function (callback) {
        if( this.isCached('all') && !this.isCacheExpired('all') ) {
            data = this._cache.all.data;
            if (callback) {
                callback.call(this, data);
            }
            this.dispatch('afterRead');
        } else {
            var that = this;
            this.read({}, function (data) {
                if (callback) {
                    callback.call(that, data);
                }
                that._cache.all = { data : data, cachedAt : (new Date())};
                that.dispatch('afterRead');
            });
        }
        return this;
    },
    find : function (id, callback) {
        var key = 'find_' + id.toString();
        if (this.isCached(key) && !this.isCacheExpired(key)) {
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
    findBy : function (attribute, value, callback) {
        var customConditions, key;
        customConditions = {};
        customConditions[attribute] = value;
        key = 'findBy_' + attribute + '_' + value;

        if (this.isCached(key) && !this.isCacheExpired(key)) {
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
        getProperty      : function (property) {
          return this[attribute];
        },
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
        updateProperties : function (properties) {
            var property;

            for (property in properties) {
                if (properties.hasOwnProperty(property)) {
                    this.setProperty(property, properties[property]);
                }
            }

            return this;
        },
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

