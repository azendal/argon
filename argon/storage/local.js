/**
Local Storage engine for Argon
The implementation is not really coupled with Argon but it was designed to be used with it
@class Local
@namespace Argon.Storage
**/
Class(Argon.Storage, 'Local')({

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
    Instance properties container
    @attribute prototype <public> [Object]
    @prototype
    **/
    prototype : {
        /**
        Contains the data for the storage instance
        @attribute storage <pubic> [Object] (null) This changes as soon as init runs, this is to avoid
        confussion and overrite the prototoype object.
        **/
        storage : null,
        
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
        Initializes the instance
        @method init <public>
        @return this
        **/
        init    : function init(config) {
            this.storage = {};
            if (typeof config !== 'unefined') {
                Object.keys(function (property) {
                    this[property] = config[property];
                }, this);
            }

            if((typeof this.processors) != 'array'){
                this.processors = [].concat(this.constructor.processors);
            }
			if((typeof this.preprocessors) != 'array'){
                this.preprocessors = [].concat(this.constructor.preprocessors);
            }
        },
        
        /**
        Creates new data on the storage instance
        @method post <public>
        @argument data <required> [Object] the data to create on the storage instance
        @argument callback [Function] The function that will be executed when the process ends
        @return [Array]
        **/
        create    : function create(requestObj, callback) {
           
            var storage = this;

            callback = callback || function defaultPostCallback() {
                //setup Error Notification here
            };
            
            if ((typeof requestObj) === 'undefined' || requestObj === null) {
               callback();
               return this;
            }
            
            requestObj.data.id = this._generateUid();

			for (i = 0; i < storage.preprocessors.length; i++) {
                requestObj.data = storage.preprocessors[i](requestObj.data);
            }
            this.storage[requestObj.data.id] = requestObj.data;
            
            var data = this.storage[requestObj.data.id];            

            for (i = 0; i < storage.processors.length; i++) {
                data = storage.processors[i](data);
            }
            callback(data);
            
            return this;
        },
        
        /**
        Retrieves a set of data on the storage instance
        @method get <public>
        @argument query <required> [Object] the query to the elements that must be updated
        @argument callback [Function] The function that will be executed when the process ends
        @return [Array]
        **/
        find : function find(requestObj, callback) {
            var found, storedData, property;

            var storage = this;
            
            callback = callback || function defaultGetCallback() {
                //nothing here maybe put error notification
            };
            
			for (i = 0; i < storage.preprocessors.length; i++) {
                requestObj.data = storage.preprocessors[i](requestObj.data);
            }

            if ((typeof requestObj) === 'undefined' || requestObj === null) {
               callback(null);
               return this;
            }
            
            found      = [];
            storedData = this.storage;

            Object.keys(storedData).forEach(function (property) {
                found.push(storedData[property]);
            });

            var data = found; 
            
            for (i = 0; i < storage.processors.length; i++) {
                data = storage.processors[i](data);
            }
            callback(data);
            
            return this;
        },

        /**
        Reads from the resource
        @method get <public>
        @argument requestObj <optional> [Object] ({data : {}, query : {}, request : {url : '/'}})
        @argument callback <optional> [Function]
        **/
        findOne : function findOne(requestObj, callback) {
            var data;
            var storage = this;

			for (i = 0; i < storage.preprocessors.length; i++) {
                requestObj.data = storage.preprocessors[i](requestObj.data);
            }

            data = Object.keys(this.storage).filter(function (property) {
                return requestObj.params.id === this.storage[property].id;
            }, this);
            
            var data = this.storage[data[0]];

            for (i = 0; i < storage.processors.length; i++) {
                data = storage.processors[i](data);
            }
            callback(data);

            return this;
        },

        /**
        Updates a set of data on the storage instance
        @method put <public>
        @argument query <required> [Object] the query to the elements that must be updated
        @argument callback [Function] The function that will be executed when the process ends
        @return [Object] this
        **/
        update : function update(requestObj, callback) {
            var storage = this;            
            callback = callback || function defaultPutCallBack() {
                //setup Error notification
            };
            
            if ((typeof requestObj) === 'undefined' || requestObj === null) {
               callback(null);
               return this;
            }
            
            if (requestObj.data) {
                for (i = 0; i < storage.preprocessors.length; i++) {
                    requestObj.data = storage.preprocessors[i](requestObj.data);
                }
            }
            
            this.storage[requestObj.data.id] = requestObj.data;
            
            var data = this.storage[requestObj.data.id];            

            for (i = 0; i < storage.processors.length; i++) {
                data = storage.processors[i](data);
            }
            callback(data);
        },
        
        /**
        Removes a set of elements from the storage
        @method remove <public>
        @argument query <required> [Object] the query to the elements that must be removed
        @argument callback [Function] The function that will be executed when the process ends
        @return [Object] this
        **/
        remove  : function remove(requestObj, callback) {
            var storageInstance = this;
            var storage = this;
            
            callback = callback || function defaultRemoveCallBack() {
                //setup Error Notification
            };
            
            if ((typeof requestObj) === 'undefined' || requestObj === null) {
               callback(null);
               return this;
            }

            if (requestObj.data) {
                for (i = 0; i < storage.preprocessors.length; i++) {
                    requestObj.data = storage.preprocessors[i](requestObj.data);
                }
            }
            
            if (requestObj.data && requestObj.data.id) {
                delete storageInstance.storage[requestObj.data.id];
            }

            callback(null);
            
            return this;
        },

        /**
        Generates a hexadecimal hash-like string based on Math.random.
        
        Declaration notice. This abstraction may seem a lil weird because codes could be part of the class
        but this way you dont have to pollute the class with the implementation of the generation algorithm.
        
        The math trick to get integers was taken from 
        https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Math/random#Example.3a_Using_Math.random
        
        @method _generateUid <private>
        @argument length <required> [Number] (32) The length of the generated string
        @return [String]
        **/
        _generateUid : (function generateUid() {
            var getUid = function(length){
                var i, uid, min, max;
                
                length = length || 32;
                uid = '';
                min = 0;
                max = 14;
                for(i = 0; i < length; i++){
                    uid += getUid.codes[ Math.floor(Math.random() * (max - min + 1)) + min ];
                }
                return uid;
            };

            getUid.codes  = [0, 1, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f'];
            
            return getUid;
        }())
    }
});
