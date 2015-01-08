Class(Argon.Storage, 'MongoDB')({
    
    prototype : {
        
        driver : null,
        collectionName : null,
        collection : null,

        preprocessors : [],
        processors : [],

        init : function init(config) {
            if(this.preprocessors instanceof Array === false){
                this.preprocessors = [].concat(this.constructor.preprocessors);
            }

            if(this.preprocessors instanceof Array === false){
                this.preprocessors = [].concat(this.constructor.preprocessors);
            }

            this.driver = config.driver;
            this.collectionName = config.collectionName;
            this.collection = config.driver.collection(this.collectionName);
            
            return this;
        },

        create : function create(requestObj, callback) {
            var storage = this;

            for (var i = 0; i < this.preprocessors.length; i++) {
                requestObj.data = this.preprocessors[i](requestObj.data, requestObj);
            }

            this.collection.insert(requestObj.data, function handleInsert(error, data) {
                if (error) {
                    return callback(error);
                }

                data = data[0];
                
                for (var i = 0; i < storage.processors.length; i++) {
                    data = storage.processors[i](data, requestObj);
                }

                callback(data);
            });

            return this;
        },

        update : function update(requestObj, callback) {
            for (i = 0; i < this.preprocessors.length; i++) {
                requestObj.data = this.preprocessors[i](requestObj.data, requestObj);
            }

            this.collection.update({_id : requestObj.data._id}, requestObj.data, function handleInsert(error, data) {
                callback(error || data);
            });

            return this;
        },

        find : function find(requestObj, callback) {
            this.collection.find().toArray(function findCallback(error, data) {
                callback(error || data.map(function (item) { return new requestObj.model(item)}));
            });

            return this;
        },

        findOne : function findOne(requestObj, callback) {
            this.collection.find({_id : requestObj.data._id}, function findCallback(error, data) {
                callback(error || data.map(function (item) { return new requestObj.model(item)})[0]);
            });

            return this;
        },

        search : function search(requestObj, callback) {
            this.collection.find(requestObj.query, function searchCallback(error, data) {
                if (error) {
                    return callback(error);
                }

                data.toArray(function arrayHandler(error, documents) {
                    callback(JSON.parse(JSON.stringify(documents)).map(function (doc) { 
                        return new requestObj.model(doc)
                    }));
                });
            });

            return this;
        },

        remove : function remove(requestObj, callback) {
            var id = requestObj.data._id;

            this.collection.remove({_id : id}, function removeCallback(error, data) {
                callback(error || data);
            });

            return this;
        }
    }
});