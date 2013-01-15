/**
JSON Argon Storage module.
This module is designed to work at the very basic functionality with a REST service on another location (not locally)

@class JsonRest
@namespace Argon.Storage
@require neon
@require Argon.Storage
@require JSON2
**/
Class(Argon.Storage, 'JsonRest')({
    /**
    Holds the code for an unprocesable entity like a validation error for example
    @attribute RESPONSE_UNPROCESSABLE_ENTITY <public, static> [Integer] (422)
    **/
    RESPONSE_UNPROCESSABLE_ENTITY  : 422,

    /**
    Holds the code for a sucessful response from te service
    @attribute RESPONSE_OK <public, static> [Integer] (200)
    **/
    RESPONSE_OK : 200,

    /**
    Holds the code for an internal server error (the application has an error we cant do anything about it)
    @attribute RESPONSE_INTERNAL_SERVER_ERROR <public, static> [Integer] (500)
    **/
    RESPONSE_INTERNAL_SERVER_ERROR : 500,

    /**
    Holds the code for an invalid URI for the service resource
    @attribute RESPONSE_NOT_FOUND <public, static> [Integer] (404)
    **/
    RESPONSE_NOT_FOUND : 404,

    /**
    Holds the code for an unexistent service or server not online at the moment
    @attribute RESPONSE_SERVER_UNAVALIABLE <public, static> [Integer] (0)
    **/
    RESPONSE_SERVER_UNAVALIABLE : 0,

    /**
    Holds the code for a request of type GET
    @attribute REQUEST_TYPE_GET <public, static> [String] ('GET')
    **/
    REQUEST_TYPE_GET : 'GET',

    /**
    Holds the code for a request of type POST
    @attribute REQUEST_TYPE_POST <public, static> [String] ('POST')
    **/
    REQUEST_TYPE_POST : 'POST',

    /**
    Holds the code for a request of type PUT
    @attribute REQUEST_TYPE_PUT <public, static> [String] ('PUT')
    **/
    REQUEST_TYPE_PUT : 'PUT',

    /**
    Holds the code for a request of type DELETE
    @attribute REQUEST_TYPE_GET <public, static> [String] ('DELETE')
    **/
    REQUEST_TYPE_DELETE : 'DELETE',

    /**
    Holds the list of processors that will be running to format and sanitize the response
    returned from the JSON service provider.

    All the processors must be synchronous for now so make sure that the return values are the result
    of the processed data.

    Example: A simple attribute sanitizer.

        Argon.Storage.JsonRest.processors.push(function(data){
            var sanitizedData, property;

            sanitizedData = {};

            for (property in data) {
                if (data.hasOwnProperty(property)) {
                    sanitizedData[property.camelize()] = data[property];
                }
            }

            return sanitizedData;
        });

    Example: Using the instantiator utility.

        Argon.Storage.JsonRest.processors.push(function(data){
            var instantiator = new Instantiator({
                classNamespace : Argon.TestModel
            });

            return instantiator.instantiateResult(data);
        });

    @attribute processors <public, static> [Array] ([])

    @todo support asynchronous processors (still not sure if this is actually needed)
    **/
    processors : [],

    /**
    Holds the list of preprocessors that will run to format, sanitize the data before sending
    it to the storage service.

    All the preprocessors must be synchronous for now so make sure that the return values are
    the intended results.

    Example : A simple dasherizer

        Argon.Storage.JsonRest.processors.push(function(data){
            var sanitizedData, property;

            sanitizedData = {};

            for (property in data) {
                if (data.hasOwnProperty(property)) {
                    sanitizedData[property.dasherize()] = data[property];
                }
            }

            return sanitizedData;
        });

    **/
	preprocessors : [],

    /**
    Internal implementation of the communication sequence with the service
    All requests at some point rely on this method to format the data and send the request to the service
    @method _sendRequest <public, static> [Function]
    @argument requestObj
    @argument callback the function to execute when the process finishes
    @return Argon.Storage.JsonRest
    **/
    _sendRequest : function _sendRequest(requestObj, callback) {
        var Storage, ajaxConfig;

        Storage = this;

        ajaxConfig = {
            url         : requestObj.config.url,
            type        : requestObj.config.type || this.REQUEST_TYPE_GET,
//            contentType : requestObj.config.contentType || 'application/json',
            global      : false,
            async       : true,
            cache       : false,
            complete    : function(xhr, message){
                Storage._processResponse(xhr, message, callback);
            }
        };

        if (ajaxConfig.type != Argon.Storage.JsonRest.REQUEST_TYPE_GET) {
            ajaxConfig.data = requestObj.data;
        }

        if (ajaxConfig.type == this.REQUEST_TYPE_PUT || ajaxConfig.type == this.REQUEST_TYPE_DELETE) {
            ajaxConfig.beforeSend = function(xhr) {
                xhr.setRequestHeader("X-Http-Method-Override", ajaxConfig.type);
            };
            ajaxConfig.type = this.REQUEST_TYPE_POST;
        }

        $.ajax(ajaxConfig);

        return this;
    },

    /**
    Internal data processing for request responses
    In order to transform the responses from the server to native models this process does certain operations
    to transform the data from the server notation to JavaScript notation
    @method _processResponse <public, static> [Function]
    @argument xhr
    @argument message
    @argument callback
    **/
    _processResponse : function (xhr, message, callback) {
        var response;

        switch (xhr.status) {
            case this.RESPONSE_OK:
                response = JSON.parse(xhr.responseText);
                break;
            case this.RESPONSE_UNPROCESSABLE_ENTITY:
                response = JSON.parse(xhr.responseText);
                break;
            case this.RESPONSE_NOT_FOUND:
                response = {
                  error : xhr.status
                };
                break;
            case this.RESPONSE_INTERNAL_SERVER_ERROR:
                response = {};
                break;
            case this.RESPONSE_SERVER_UNAVALIABLE:
                console.log('Server is unavailable, probably shutdown.');
                response = {};
                break;
            default:
                console.log('Unsuported code returned from the server: ', xhr.status);
                response = {
                    error : xhr.status
                }
        }

        callback(response);

        return this;
    },

    /**
    Instance properties container
    @attribute prototype <public> [Object]
    @prototype
    **/
    prototype : {

        /**
        Holds the processors that are specific only for the instance of the storage
        @property processors <public> [Array] (null)
        **/
        processors : null,

        /**
        Holds the preprocessors that are specific only for the instance of the storage
        @property preprocessors <public> [Array] (null)
        **/
		preprocessors : null,
        
        /**
        Contains the resource routes for the model.
        every property matches the name of a method that will do an operation with the resource
        @attribute url <public> [Object] ({post: '', get: '', put: '', remove: ''})
        **/
        url : {
            all    : '',
            show   : '',
            post   : '',
            put    : '',
            remove : ''
        },

        /**
        Initializes the instance
        @method init <public>
        @argument config <required> [Object]
        @return this
        **/
        init : function (config) {
            var property;

            for (property in config) {
                if (config.hasOwnProperty(property)) {
                    this[property] = config[property];
                }
            }

            if((typeof this.processors) != 'array'){
                this.processors = [].concat(this.constructor.processors);
            }
			if((typeof this.preprocessors) != 'array'){
                this.preprocessors = [].concat(this.constructor.preprocessors);
            }
        },

        /**
        Pushes the instance to the storage service
        @method post <public>
        @argument requestObj <optional> [Object] the data to post, generally this comes from a model
        @argument callback <optional> [Function]
        **/
        post : function (requestObj, callback) {

            var i, requestConfig, storage;

            storage = this;

            callback = callback || function(){};

            if ((typeof requestObj) === 'undefined' || requestObj === null) {
                callback(null);
                return this;
            }

            requestObj.config.url = requestObj.config.url || this.url.post;
            requestObj.config.type = requestObj.config.type || this.constructor.REQUEST_TYPE_POST;

            this.constructor._sendRequest(requestObj, function(data){
                for (i = 0; i < storage.processors.length; i++) {
                    data = storage.processors[i](data);
                }
                callback(data);
            });

            return this;
        },

        /**
        Reads from the resource
        @method get <public>
        @argument requestObj <optional> [Object] ({data : {}, query : {}, request : {url : '/'}})
        @argument callback <optional> [Function]
        **/
        get : function (requestObj, callback) {
            var i, found, storedData, property, requestConfig, storage;

            storage = this;
            callback = callback || function(){};

			for (i = 0; i < storage.preprocessors.length; i++) {
                requestObj.data = storage.preprocessors[i](requestObj.data);
            }

            if (typeof requestObj === 'undefined' || requestObj === null) {
                callback(null);
                return this;
            }

            requestObj.config.url = requestObj.config.url || this.url.get;
            requestObj.config.type = requestObj.config.type || this.constructor.REQUEST_TYPE_GET;

            this.constructor._sendRequest(requestObj, function(data){
                for (i = 0; i < storage.processors.length; i++) {
                    data = storage.processors[i](data);
                }
                callback(data);
            });

            return this;
        },

        /**
        Reads from the resource
        @method get <public>
        @argument requestObj <optional> [Object] ({data : {}, query : {}, request : {url : '/'}})
        @argument callback <optional> [Function]
        **/
        show : function (requestObj, callback) {
            var i, found, storedData, property, requestConfig, storage;

            storage = this;
            callback = callback || function(){};

			for (i = 0; i < storage.preprocessors.length; i++) {
                requestObj.data = storage.preprocessors[i](requestObj.data);
            }

            if (typeof requestObj === 'undefined' || requestObj === null) {
                callback(null);
                return this;
            }

            requestObj.config.url = requestObj.config.url || this.url.show;
            requestObj.config.type = requestObj.config.type || this.constructor.REQUEST_TYPE_GET;

            this.constructor._sendRequest(requestObj, function(data){
                for (i = 0; i < storage.processors.length; i++) {
                    data = storage.processors[i](data);
                }
                callback(data);
            });

            return this;
        },

        /**
        Updates from the resource
        @method put <public>
        @argument params <optional> [Object]
        @argument callback <optional> [Function]
        **/
        put : function (requestObj, callback) {

            var found, storedData, property, storage;

            storage = this;

            callback = callback || function(){};

            if ((typeof requestObj) === 'undefined' || requestObj === null) {
                callback(null);
                return this;
            }

            requestObj.config.url = requestObj.config.url || this.url.put;
            requestObj.config.type = requestObj.config.type || this.constructor.REQUEST_TYPE_PUT;

            this.constructor._sendRequest(requestObj, function(data){
                for (i = 0; i < storage.processors.length; i++) {
                    requestObj.data = storage.processors[i](requestObj.data);
                }
                callback(data);
            });

            return this;
        },

        /**
        Removes this from the resource

        Delete cannot be used because its a reserved word on JavaScript and for now is safer to use a synonim
        later this could be aliased by the correct method

        @method remove <public>
        @argument params <optional> [Object]
        @argument callback <optional> [Function]
        **/
        remove : function (requestObj, callback) {

            var requestConfig, storage;

            storage = this;

            callback = callback || function(){};

            if ((typeof requestObj) === 'undefined' || requestObj === null) {
                callback(null);
                return this;
            }

            requestObj.config.url = requestObj.config.url || this.url.remove;
            requestObj.config.type = requestObj.config.type || this.constructor.REQUEST_TYPE_PUT;

            this.constructor._sendRequest(requestObj, function(data){
                for (i = 0; i < storage.processors.length; i++) {
                    requestObj.data = storage.processors[i](requestObj.data);
                }
                callback(data);
            });

            return this;
        }
    }
});

