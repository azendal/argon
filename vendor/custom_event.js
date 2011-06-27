Class('CustomEvent')({
	type             : '',
	target           : null,
	_stopPropagation : false,
	prototype : {
		init : function(type, data){
			var property;
			this.type = type;
			for(property in data){
			    if(data.hasOwnProperty(property)){
			        this[property] = data[property];
			    }
			}
		},
		stopPropagation : function(){
			this._stopPropagation = true;
		},
		preventDefault : function(){
			this._preventDefault = true;
		}
	}
});
