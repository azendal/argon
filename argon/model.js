Module(Argon, 'Model').includes(CustomEventSupport, ValidationSupport)({
    storage : null,
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
    all : function (callback) {
      this.read({}, callback);
      return this;
    },
    find : function (id, callback) {
      this.read({conditions : {id : id}}, callback);
      return this;
    },
    find_by : function (attribute, value, callback) {
      var customConditions = {};
      customConditions[attribute] = value;

      this.read({conditions : customConditions}, callback);

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

