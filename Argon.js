/**
 * JSRecord: A JavaScript implementation of ActiveResource
 * @author: Fernando Trasviña
 * @colaborators: Ivan Torres
 * @class JSRecord
 * @requires neon
 */
Class('JSRecord')({
  storage : null,
  /**
   * Finds all the records from the model
   * @method all
   */
  all : function(){
    var data = this.storage.read();
    var instances = [];
    var Constructor = this;
    $.each(data, function(){
      instances.push(new Constructor(this));
    });
    return instances;
  },
  /**
   * Find a specific record by its id
   * @method find
   */
  find : function(id){
    var data = this.storage.find(id) || null;
    return new this(data);
  },
  /**
   * Find the first record
   * @method first
   */
  first : function(){
    return this.all()[0];
  },
  /**
   * Build a new instance (equivalent to new, but Internet Explorer crashes)
   * @method build
   */
  build : function(attrs){
    return (new this(attrs));
  },
  /**
   * Create a new record from the passed attributes
   * @method create
   */
  create : function(attrs){
    return this.build(attrs).save();
  },

  prototype : {
    initializer : function(attrs){
      $.extend(this, attrs);
    },
    /**
     * Creates or updates the record of this instance
     * @method save
     */
    save : function(){
      var response;
      if(this.id){
        response = this.constructor.storage.update(this)
      }
      else{
        response = this.constructor.storage.create(this)
      }
      return $.extend(this, reponse);
    }
  }
});
