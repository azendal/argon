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
        @return this
        **/
        init    : function (config) {
            this.storage = {};
            if (typeof config === 'unefined') {
                Object.keys(function (property) {
                    this[property] = config[property];
                }, this);
            }
        },
        
        /**
        Creates new data on the storage instance
        @method post <public>
        @argument data <required> [Object] the data to create on the storage instance
        @argument callback [Function] The function that will be executed when the process ends
        @return [Array]
        **/
        post    : function (requestObj, callback) {
            
            callback = callback || function defaultPostCallback() {
                //setup Error Notification here
            };
            
            if ((typeof requestObj) === 'undefined' || requestObj === null) {
               callback();
               return this;
            }
            
            requestObj.data.id = this._generateUid();
            this.storage[requestObj.data.id] = requestObj.data;
            callback(this.storage[requestObj.data.id]);
            
            return this;
        },
        
        /**
        Retrieves a set of data on the storage instance
        @method get <public>
        @argument query <required> [Object] the query to the elements that must be updated
        @argument callback [Function] The function that will be executed when the process ends
        @return [Array]
        **/
        get     : function (requestObj, callback) {
            var found, storedData, property;
            
            callback = callback || function defaultGetCallback() {
                //nothing here maybe put error notification
            };
            
            if ((typeof requestObj) === 'undefined' || requestObj === null) {
               callback(null);
               return this;
            }
            
            found      = [];
            storedData = this.storage;

            Object.keys(storedData).forEach(function (property) {
                found.push(storedData[property]);
            });
            
            callback(found);
            
            return this;
        },

        show : function show(requestObj, callback) {
            var data;
            data = Object.keys(this.storage).filter(function (property) {
                return requestObj.urlData.id === this.storage[property].id;
            }, this);
            callback(this.storage[data[0]]);
            return this;
        },

        /**
        Updates a set of data on the storage instance
        @method put <public>
        @argument query <required> [Object] the query to the elements that must be updated
        @argument callback [Function] The function that will be executed when the process ends
        @return [Object] this
        **/
        put     : function (requestObj, callback) {
            
            callback = callback || function defaultPutCallBack() {
                //setup Error notification
            };
            
            if ((typeof requestObj) === 'undefined' || requestObj === null) {
               callback(null);
               return this;
            }
            
            this.storage[requestObj.data.id] = requestObj.data;
            callback(this.storage[requestObj.data.id]);
        },
        
        /**
        Removes a set of elements from the storage
        @method remove <public>
        @argument query <required> [Object] the query to the elements that must be removed
        @argument callback [Function] The function that will be executed when the process ends
        @return [Object] this
        **/
        remove  : function (requestObj, callback) {
            var storageInstance = this;
            
            callback = callback || function defaultRemoveCallBack() {
                //setup Error Notification
            };
            
            if ((typeof requestObj) === 'undefined' || requestObj === null) {
               callback(null);
               return this;
            }
            
            if (requestObj.conditions) {
                delete storageInstance.storage[requestObj.conditions.id];
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
