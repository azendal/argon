/**
Provides property snake case encoding for objects
@class PropertyEncoder
**/
Class("PropertyEncoder")({
    /**
    encondes the properties of the object with snake case style in a recursive strategy
    @property encode [Function]
    @param params [Object] any JavaScript
    @return object* [Object] the modified object
    **/
    encode : function encode(params) {
        var data, property, className;

        if(params === null){
            return params;
        }

        className = Object.prototype.toString.call(params).replace('[object ', '').replace(']', '');

        if ( className == 'Object' ) {
            data = {};

            Object.keys(params).forEach(function (property) {
                if ( (typeof params[property] !== 'undefined') && (typeof params[property] !== 'function') ) {
                    data[property.toString().underscore()] = this.encode(params[property]);
                }
            }, this);

        } else if (className == 'Array') {

            data = params.map(function (value) {
                return this.encode(value);
            }, this);

        } else {
            data = params;
        }

        return data;
    }
});
