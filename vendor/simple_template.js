Class('PlaceHolder')({
    REPLACEMENT_REGEXP : /\{(\w+)\}/g,
    replace : function(str, data){
        var placeHolder = this;
        return str.replace(this.REPLACEMENT_REGEXP, function(string, key){
            console.log(string, key);
            return placeHolder._executeReplacement(string, key, data);
        });
    },
    _executeReplacement : function(string, key, data){
        return data[key];
    }
});