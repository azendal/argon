/**
 * @author: Fernando Trasviña
 * @colaborators: Ivan Torres
 */
Class('RestStorage')({
  /**
  /* Sends a general request through ajax
   * @method sendRequest
   */
  sendRequest : function(params){
    if (null == params.url) {
      console.log('the url is not defined');
      console.log(this);
      return;
    };
    var config = {
      type        : 'GET',
      global      : false,
      async       : false,
      contentType : 'application/json'    
    };
    config.url = this.formatUrl(params.url, params.data);
    config.data = this.formatData(params.data);
    config.type = params.type || 'GET';
    var response = eval('(' + $.ajax(config).responseText + ')');
    var result;
    var that = this;
    if (response instanceof Array) {
      result = [];
      $.each(response, function() {
        result.push(that.decodeFields(this));
      });
    } else {
      result = this.decodeFields(response);
    }
    console.log(response);
    console.log(result);
    return result;
  },
  decodeFields : function(element) {
    properties = {};
    $.each(element, function(key,value) {
      properties[key.camelize()] = value;
    });
    return properties;
  },
  /**
  * Finds parameters in the URL and replaces for the actual
  * value of the attribute from the instance
  * @method formatUrl
  */
  formatUrl : function(url, params) {
    var facilito = params;
    var chunker = /\{:(\w+)\}/g;
    var parts = [];
    while ((m = chunker.exec(url)) !== null ) {
      parts.push(m[1]);
    }
    $.each(parts, function(i){
      url = url.replace('{:' + this + '}', params[this]);
    });
    return url + '.js';
  },
  formatData : function(param) {
    param = param || {};
    var data = '';
    var results = [];
    for (var property in param) {
      if (param.hasOwnProperty(property) && !(param[property] instanceof Function)) {
        results.push('"' + property.toString().underscore() + '":"' + param[property].toString() + '"');
      }
    }
    data += '{"' + param.constructor.name.toString().underscore() + '":{' + results.join(', ') + '}}';
    return data; 
  },
  prototype : {
    /**
     * Attrubute object for the url
     * @attribute url
     */
    url : {},
    initializer : function(config){
      this.url = {};
      $.extend(this, config);
    },
    /**
     * Finds all records from the JsRecord
     * @method read
     * @param params {Object}
     */
    read : function(params){
      return this.constructor.sendRequest({
        url  : this.url.read,
        data : params
      });
    },
    /**
     * Finds a record with the specified id
     * @method find
     */
    find : function(id, params){
      params = params || {};
      $.extend(params, { id: id });
      return this.constructor.sendRequest({
        url  : this.url.find,
        data : params
      });
    },
    /**
     * Updates a record with the provided parameters
     * @method update
     */
    update : function(params){
      return this.constructor.sendRequest({
        url  : this.url.update,
        data : params || {},
        type : 'PUT'
      });
    },
    /**
     * Creates a new record with the provided parameters
     * @method create
     */
    create : function(params){
      return this.constructor.sendRequest({
        url  : this.url.create,
        data : params || {},
        type : 'POST'
      });
    },
    /**
     * Deletes an existing record with the specified id
     * @method remove
     */
    remove : function(id, params){
      params = params || {};
      $.extend(params, { id: id });
        return this.constructor.sendRequest({
          url  : this.url.remove,
          data : params,
          type : 'POST'
        });
      }
    }
  }
);
