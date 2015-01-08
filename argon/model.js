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
    Fetches all records of a given Model and creates the instances.
    @method all <public, static>
    @argument callback <optional> [Function] method to handle data.
    @return [Argon.Model].
    **/
    all : function all(callback) {
        var Model = this;
        var request = {
            find : 'find',
            model : Model
        };
        
        this.dispatch('beforeAll'); 
        this.storage.find(request, function findCallback(data) {
            if (callback) {
                callback(data);
                Model.dispatch('afterAll');
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
    find : function find(id, callback) {
        var Model, request;

        Model = this;
        request = {
            action : 'findOne',
            model : Model,
            params : {
                id : id
            }
        };
        this.storage.findOne(request, function findOneCallback(data) {
            if (callback) {
                callback(data);
            }
        });
        return this;
    },

    /**
    Fetches as many record matching a given query. Query lenguaje and structure 
    depends on the storage used for the model.
    @method search <public, static>
    @argument query <required> [Object] the query with the criteria to perform the lookup.
    @argument callback <optional> [Function] method to handle data.
    @return [Array].
    **/
    search : function search(query, callback) {
        var Model;

        Model = this,
        request = {
            action : 'search',
            model : Model,
            query : query
        };

        this.storage.search(request, function searchCallback(data) {
            if (callback) {
                callback(data);
            }
        });

        return this;
    },
    
    prototype : {

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
        Saves the model to storage.
        @method save <public>
        @argument callback <required> [Function] function to manage response.
        @return Noting.
        **/
        save : function save(callback) {
            var model, request;

            model = this;

            this.constructor.dispatch('beforeSave', {
                data : {
                    model : this
                }
            });
            this.dispatch('beforeSave');

            this.isValid(function (isValid) {
                if (isValid) {
                    if (model.hasOwnProperty('id') && model.id !== '') {
                        request = {
                            action : 'update',
                            data : model,
                            model : model.constructor
                        };
                        model.constructor.storage.update(request, function updateCallback(data) {
                            model.constructor.dispatch('afterSave', {
                                data : {
                                    model : model
                                }
                            });

                            model.dispatch('afterSave');
                            if (callback) {
                                callback(data);
                            }
                        });
                    }
                    else {
                        request = {
                            action : 'create',
                            data : model,
                            model : model.constructor
                        };
                        model.constructor.storage.create(request, function createCallback(data) {
                            model.constructor.dispatch('afterSave', {
                                data : {
                                    model : model
                                }
                            });

                            model.dispatch('afterSave');
                            if (callback) {
                                callback(data);
                            }
                        });
                    }
                } else {
                    if (callback) {
                        callback(data);
                    }
                }
            });

        },
        
        /**
        Removes a record from storage.
        @method destroy <public>
        @argument callback [Function] function to manage response.
        @return Noting.
        **/
        destroy : function destroy(callback) {
            var model = this;
            var request = {
                action : 'remove',
                model : model.constructor,
                data : this
            };
            this.dispatch('beforeDestroy');

            this.constructor.storage.remove(request, function destroyCallback() {
                model.setProperty('id', null);
                model.dispatch('afterDestroy');
                if (callback) {
                    callback(model);
                }
            });
        }
    }
});
