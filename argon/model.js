/**
This is the default Model functionality that Argon provides. Models include
Events and Validations. All packaged in a module you can include on your objects.
@module Model
@namespace Argon
@includes CustomEventSupport
@includes ValidationSupport
**/
Module(Argon, 'Model').includes(CustomEventSupport, ValidationSupport)({
    
    /**
    Contains the instance of the storage adapter for the model
    This property must be set when creating the model
    @property storage <public> [Storage] (null)
    **/
    storage : null,
    
    /**
    Builds a new instance of Argon Model and saves to storage.
    @method create <public, static>
    @argument data <required> [Object] the attributes of the model.
    @return [Argon.Model]
    **/
    create : function create(data, callback) {
        var model;
        this.dispatch('beforeCreate');
        model = new this(data);
        model.save(callback, function (instance) {
            this.dispatch('afterCreate');
            return instance;
        });
        return this;
    },
    
    /**
    Builds a new instance of Argon Model from storage.
    @method read <public, static>
    @argument query <required> [Object] conditions to match.
    @argument callback <optional> [function] function to handle data.
    @return [Argon.Model]
    **/
    read : function read(query, callback) {
        var Model;
        query = query || {};

        Model = this;

        this.dispatch('beforeRead');

        query.className = this.className;

        this.storage.get({config : {}, conditions : query}, function(data){
            Model.dispatch('afterRead');
            if (callback) {
                callback(data);
            }
        });

        return this;
    },
    
    /**
    Fetches all records of a given Model and creates the instances.
    @method all <public, static>
    @argument callback <optional> [Function] method to handle data.
    @return [Argon.Model].
    **/
    all : function all(callback) {
        var Model, data;
        
        Model = this;
        this.read({config : {}}, function (data) {
            if (callback) {
                callback.call(Model, data);
            }
        });
        
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
        var data;
        var Model = this;
        this.dispatch('beforeRead');
        this.storage.show({config : {
                url : this.storage.url.show.replace('{:id}', id)
            },
            urlData : {
                id : id
            }
        }, function (data) {
            Model.dispatch('afterRead');
            if (callback) {
                callback.call(Model, data);
            }
        });
        return this;
    },
    
    prototype : {
        /**
        Contain the errors for the model instance
        @property errors <public> [Array] ([])
        **/
        errors : [],

        /**
        Object initializer, this method server as the real constructor
        @method init <public>
        @argument properties <optional> [Object] ({}) the attributes for the model isntance
        **/
        init : function init(properties) {
            this.eventListeners = [];

            if (typeof properties !== 'undefined') {
                Object.keys(properties).forEach(function (property) {
                    this[property] = properties[property];
                }, this);
            }

            return this;
        },
        
        /**
        Exposes the value of a property.
        @method getProperty <public>
        @argument property <required> [String] the property to expose.
        @return [Object] the property value.
        **/
        getProperty : function getProperty(property) {
            return this[property];
        },
        
        /**
        Sets the value of a property.
        @method setProperty <public>
        @argument property <required> [String] the property to write.
        @argument newValue <required> [String] the value for the property.
        @return [Object] instance of the model.
        **/
        setProperty : function setProperty(property, newValue) {
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
        updateProperties : function updateProperties(properties) {
            Object.keys(properties).forEach(function (property) {
                this.setProperty(property, properties[property]);
            }, this);

            return this;
        },
        
        /**
        Saves the model to storage.
        @method save <public>
        @argument callback <required> [Function] function to manage response.
        @return Noting.
        **/
        save : function save(callback) {
            var model;

            model = this;

            this.dispatch('beforeSave');
            if (!this.isValid()) {
                return model;
            }

            if (this.hasOwnProperty('id') && this.id !== '') {
                this.constructor.storage.put({confing : {}, data : this}, function(data){
                    model.dispatch('afterSave');
                    if (callback) {
                        callback(data);
                    }
                });
            }
            else {
                this.constructor.storage.post({config : {}, data : this}, function(data){
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
        destroy : function destroy(callback) {
            var model = this;
            this.dispatch('beforeDestroy');

            this.constructor.storage.remove({
                config : {},
                conditions : { id : this.getProperty('id') }
            }, function () {
                model.setProperty('id', null);
                model.dispatch('afterDestroy');
                if (callback) {
                    callback(model);
                }
            });
        }
    }
});

