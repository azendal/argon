/**
Provides Instantiation of JavaScript objects with the camel case notation
@class Instantiator
**/
Class("Instantiator")({
  prototype : {

    /**
    Provides a way to tell the instantiate process where
    the model classes are located on the system
    @property classNamespace <public, static> [Object]
    **/
    classNamespace : {},

    /**
    Initialization function
    @property init <public, static> [Function]
    @argument config <required> [Object] {undefined} configuration object
    **/
    init : function init(config) {
      this.classNamespace = config.classNamespace || window;
      return this;
    },

    /**
    Takes care of the process of instantiation of arbitrary objects into camel case
    properties recursively and also takes care of instantiating the respective
    Argon model.
    It only instantiates objects that contain the property _className hinting which
    model is the one that corresponds to this object.
    @property instantiate <public, static> [Function]
    @argument element <required> [Object] {undefined} the object to instantiate
    @return object
    **/
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

    /**
    takes care of the property naming convention change
    @property camelizeProperties <public, static> [Function]
    @argument element <required> [Object]
    @return object
    **/
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

