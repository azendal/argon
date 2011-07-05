if (!String.prototype.underscore) {
    String.prototype.underscore = function() {
        return this.replace(/::/g, '/')
            .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
            .replace(/([a-z\d])([A-Z])/g, '$1_$2')
            .replace(/-/g, '_')
            .toLowerCase();
    };
}

if (!String.prototype.dasherize) {
    String.prototype.dasherize = function() {
    return this.replace(/_/g, '-');
  }
}

if (!String.prototype.camelize) {
    String.prototype.camelize = function() {
        return this.replace(/(?!^[-_]{0,1})[-_]+(.)?/g,
        function(match, chr) {
            return chr ? chr.toUpperCase() : '';
        });
    };
}

if (!String.prototype.classify) {
    String.prototype.classify = function() {
        return this.replace(/(^[a-z])/,
        function(match, chr) {
            return chr ? chr.toUpperCase() : '';
        });
    };
}

if (!String.prototype.capitalize) {
    String.prototype.capitalize = function() {
        return this.charAt(0).toUpperCase() + this.substring(1).toLowerCase();
    };
}

