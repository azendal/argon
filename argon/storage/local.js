/**
Local Storage engine for Argon
The implementation is not really coupled with Argon but it was designed to be used with it
@class Local
@namespace Argon.Storage
**/
Class(Argon.Storage, 'Local')({
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
        Initializes the instance
        @method init <public>
        @return this
        **/
        init    : function () {
            this.storage = {};
        },
        
        /**
        Creates new data on the storage instance
        @method post <public>
        @argument data <required> [Object] the data to create on the storage instance
        @argument callback [Function] The function that will be executed when the process ends
        @return [Array]
        **/
        post    : function (data, callback) {
            
            callback = callback || function(){};
            
            if ((typeof data) === 'undefined' || data === null) {
               callback(data);
               return this;
            }
            
            data.id = this._generateUid();
            this.storage[data.id] = data;
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
        get     : function (query, callback) {
            var found, storedData, property;
            
            callback = callback || function(){};
            
            if ((typeof query) === 'undefined' || query === null) {
               callback(null);
               return this;
            }
            
            found      = [];
            storedData = this.storage;
            
            for (property in storedData) {
                if (storedData.hasOwnProperty(property)) {
                    found.push(storedData[property]);
                }
            }
            
            var filtered = [];
            
            for (var i = 0; i < found.length; i++) {
                for (property in query.conditions) {
                    
                    if (!query.conditions.hasOwnProperty(property)) {
                        continue;
                    }
                    
                    var foundRecord = true;
                    
                    if (!found[i].hasOwnProperty(property) || found[i][property] != query.conditions[property]) {
                        foundRecord = false;
                    }
                    
                    if (foundRecord === true) {
                        filtered.push(found[i]);
                    }
                }
            }

            var returnFiltered = false;

            for (property in query.conditions) {
                if (query.conditions.hasOwnProperty(property)) {
                    returnFiltered = true;
                }
            }
            
            if (returnFiltered === true) {
               callback(filtered);
            }
            else {
                callback(found);
            }
            
            return this;
        },

        /**
        Updates a set of data on the storage instance
        @method put <public>
        @argument query <required> [Object] the query to the elements that must be updated
        @argument callback [Function] The function that will be executed when the process ends
        @return [Object] this
        **/
        put     : function (data, callback) {
            
            callback = callback || function(){};
            
            if ((typeof data) === 'undefined' || data === null) {
               callback(data);
               return this;
            }
            
            this.storage[data.id] = data;
            callback(this.storage[data.id]);
        },
        
        /**
        Removes a set of elements from the storage
        @method remove <public>
        @argument query <required> [Object] the query to the elements that must be removed
        @argument callback [Function] The function that will be executed when the process ends
        @return [Object] this
        **/
        remove  : function (query, callback) {
            var storageInstance = this;
            
            callback = callback || function(){};
            
            if ((typeof query) === 'undefined' || query === null) {
               window.setTimeout(function(){
                   callback(null);
               }, 0);
               return this;
            }
            
            this.get(query, function(data){
                var i;
                for (i=0; i < data.length; i++) {
                    delete storageInstance.storage[data[i].id];
                }
                callback();
            });
            
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
        _generateUid : (function () {
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