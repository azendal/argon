/**
A synchronous support module for model that want to use SyncDaemon for MongoDb 
This api asumes synchronous storage
@module SyncDaemonSupport
@namespace Argon
**/
Module(Argon, 'SyncDaemonSupport')({
    prototype : {       
        /**
        Saves the model to storage.
        @method save <public>
        @return Noting.
        **/
        save             : function () {
            var model;

            model = this;

            this.dispatch('beforeSave');
            if (!this.isValid()) {
                return model;
            }

            if (this.hasOwnProperty('id') && this.id !== '') {
                //this.constructor.storage.put(this);
                this.id = this._generateUid(24); 
                SyncDaemon.push(this);
                model.dispatch('afterSave');
            }
            else {
                this.constructor.storage.post(this);
                SyncDaemon.push(this);
                model.dispatch('afterSave');
            }

            return this;
        },
        
        /**
        Removes a record from storage.
        @method destroy <public>
        @return Noting.
        **/
        destroy          : function () {
            var model = this;
            this.dispatch('beforeDestroy');

            this.willDestroy = true;
            SyncDaemon.push(this);
            model.dispatch('afterDestroy');
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


