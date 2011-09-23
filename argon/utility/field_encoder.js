Class("FieldEncoder")({
	encode : function(params) {
	    if(params === null){
	        return params;
	    }
	    var data;
		var obj;
	    var that = this;
		className = Object.prototype.toString.call(params).replace('[object ', '').replace(']', '');
		
	    if ( className == 'Object' ) {
	        data = {};
			
			for( obj in params ) {
				if ( params.hasOwnProperty ( obj ) ) {
					if ( (typeof params[obj] !== 'undefined') && (typeof params[obj] !== 'function') ) {
						data[obj.toString().underscore()] = that.encode(params[obj]);
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