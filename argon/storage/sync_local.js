
/**
Local Storage engine for Argon
The implementation is not really coupled with Argon but it was designed to be used with it
@class Local
@namespace Argon.Storage
**/
Class(Argon.Storage, 'SyncLocal')({
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
        @return [Array]
        **/
        post    : function (data) {
            
            if ((typeof data) === 'undefined' || data === null) {
               return [];
            }
            
            data.id = this._generateUid();
            this.storage[data.id] = data;

            return data;
        },
        
        /**
        Retrieves a set of data on the storage instance
        @method get <public>
        @argument query <required> [Object] the query to the elements that must be updated
        @return [Array]
        **/
        get     : function (query) {
            var found, storedData, property, storageKey;
            
            if ((typeof query) === 'undefined' || query === null) {
               return [];
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
            
            if (returnFiltered == true) {
               return filtered;
            }
            else {
               return found;
            }
            
        },

        /**
        Updates a set of data on the storage instance
        @method put <public>
        @argument query <required> [Object] the query to the elements that must be updated
        @return [Object] this
        **/
        put     : function (data) {
            
            if ((typeof data) === 'undefined' || data === null) {
               return data;
            }
            
            this.storage[data.id] = data;
            
            return this.storage[data.id];
        },
        
        /**
        Removes a set of elements from the storage
        @method remove <public>
        @argument query <required> [Object] the query to the elements that must be removed
        @return [Null] null
        **/
        remove  : function (query) {
            var storageInstance = this;
            
            if ((typeof query) === 'undefined' || query === null) {
               return null;
            }
            
            var data = this.get(query);
            var i;
            for (i=0; i < data.length; i++) {
                delete storageInstance.storage[data[i].id];
            };
            
            return null;
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
                length = length || 32;
                var str = '';
                var min = 0;
                var max = 14;
                for(var i = 0; i < length; i++){
                    str += getUid.codes[ Math.floor(Math.random() * (max - min + 1)) + min ];
                }
                return str;
            };

            getUid.codes  = [0, 1, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f'];
            
            return getUid;
        }())
    }
});
