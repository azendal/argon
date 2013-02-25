Class('PlaceHolder')({
    REPLACEMENT_REGEXP : /\{(\w+)\}/g,
    replace : function replace(str, data){
        var placeHolder = this;
        return str.replace(this.REPLACEMENT_REGEXP, function replacingFunction(string, key) {
            return placeHolder._executeReplacement(string, key, data);
        });
    },
    _executeReplacement : function _executeReplacement(string, key, data) {
        return data[key];
    }
});
