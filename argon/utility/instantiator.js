Class("Instantiator")({
  prototype : {

    classNamespace : {},

    init : function init(config) {
      this.classNamespace = config.classNamespace || window;
      return this;
    },

    instantiate : function instantiate(element) {
        var property, i, result, className;
        
        className = Object.prototype.toString.call(element).replace('[object ', '').replace(']', '');
        
        if ('Array' === className) {
            result = [];

            for(i = 0; i < element.length; i++) {
                result.push(this.instantiate(element[i]));
            }
        }
        else if ( 'Object' === className ) {
            element = this.camelizeProperties(element);
            
            result = {};
            for(property in element) {
                if (element.hasOwnProperty(property)) {
                    result[property] = this.instantiate(element[property]);
                }
            }

            if (result.hasOwnProperty('_className') && this.classNamespace[result._className]) {
                result = new this.classNamespace[result._className](result);
            }
        }
        else {
            result = element;
        }
        
        return result;
    },

    camelizeProperties : function camelizeProperties(element) {
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

