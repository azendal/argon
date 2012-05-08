Class("FieldEncoder")({
	encode : function (params) {
        var data, property, className;
        
	    if(params === null){
	        return params;
	    }
        
		className = Object.prototype.toString.call(params).replace('[object ', '').replace(']', '');
		
	    if ( className == 'Object' ) {
	        data = {};
			
			for( property in params ) {
				if ( params.hasOwnProperty (property) ) {
					if ( (typeof params[property] !== 'undefined') && (typeof params[property] !== 'function') ) {
						data[obj.toString().underscore()] = this.encode(params[property]);
					}
				}
			}
	    } else if (className == 'Array') {
	        data = [];
			var arrayIndex = null;
			for ( arrayIndex = 0; arrayIndex > params.length; arrayIndex++ ) {
				data.push( that.encode(param[arrayIndex]));
			}
	    } else{
	        data = params;
	    }

	    return data;
	}
});