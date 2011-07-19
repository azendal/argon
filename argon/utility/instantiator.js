Class("Instantiator")({
  prototype : {

    aliases : {},
    associationAliases : {},
    classNamespace : {},

    init : function(config) {
      this.classNamespace = config.classNamespace || window;
      return this;
    },

    instantiateResult : function(element) {
        var property, i, result, className;
        
        className = Object.prototype.toString.call(element).replace('[object ', '').replace(']', '');
        
        if ('Array' === className) {
            result = [];

            for(i = 0; i < element.length; i++) {
                result.push(this.instantiateResult(element[i]));
            }
        }
        else if ( 'Object' === className ) {
            element = this.decodeFields(element);
            
            if (element.hasOwnProperty('_className')) {
                result = new this.classNamespace[element._className]({id : element.id});
            }
            else {
                result = element;
            }
            
            for(property in element) {
                if (element.hasOwnProperty(property)) {
                    result[property] = this.instantiateResult(element[property]);
                }
            }
        }
        else {
            result = element;
        }
        
        return result;
    },


    decodeFields : function(element) {
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

