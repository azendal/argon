Class("Instantiator")({
  prototype : {

    aliases : {},
    associationAliases : {},
    classNamespace : {},

    init : function(config) {
      this.classNamespace = config.classNamespace || window;
      return this;
    },

    instantiateResult: function(element) {

        var that     = this;
        var instance = null;

        if(element === null || typeof(element) === 'undefined'){
            return;
        }

        if(element.constructor === Array){
            var instances = [];

            for(var arrayIndex = 0; arrayIndex < element.length; arrayIndex++) {
                instances.push(that.instantiateResult(element[arrayIndex]));
            }

            return instances;
        }
        else if (element.constructor === Object){
            element = this.decodeFields(element);
            if (element.hasOwnProperty('_className')) {
              instance = new this.classNamespace[element._className]({id : element.id});
            }
            for(var key in element) {
                if (element.hasOwnProperty(key)) {
                    var val = element[key];
                    if (val.constructor == Array) {
                      for (var arrayIndex = 0; arrayIndex < val.length; arrayIndex++) {
                        val[arrayIndex] = that.instantiateResult(val[arrayIndex]);
                      }
                    } else if (val.constructor == Object) {
                        val = that.instantiateResult(val);
                    }
                    (instance || element)[key] = val;
                }
            }
        }
        return instance || element;
    },


    decodeFields: function(element) {
        var properties = {};
        var keyName;
        for(var key in element) {
            if (element.hasOwnProperty(key)) {
                keyName = key.toString().camelize();
                properties[keyName] = element[key];
            }
        }
        return properties;
    }

  }
});

