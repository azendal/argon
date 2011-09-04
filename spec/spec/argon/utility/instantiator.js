Argon.TestModel = {};

Class(Argon.TestModel, "ExampleModel").includes(Argon.Model)({});
Class(Argon.TestModel, "ParentModel").includes(Argon.Model)({});
Class(Argon.TestModel, "ChildModel").includes(Argon.Model)({});

Te.suite("Model Instantiator")(function(){

  var instantiator = new Instantiator({
    classNamespace : Argon.TestModel,
    associationAliases : {
      ParentModel : {
        child : "child",
        children : "children"
      }
    }
  });

  this.beforeEach(function(){
    this.registry.plainObject = {
      _className     : "ExampleModel",
      x              : 100,
      y              : 200,
      z              : 300,
      animation_time : 200
    };

  });

  this.specify("Decode fields should return instance of ExampleModel")(function(spec) {
    var result = instantiator.instantiateResult(this.registry.plainObject);
    spec.assert(result.constructor.className).toEqual(Argon.TestModel.ExampleModel.className);
    spec.completed();
  });

  this.specify("instantiateResult should return instance of ExampleModel with camel case fields")(function(spec) {
    var result = instantiator.instantiateResult(this.registry.plainObject);
    spec.assert(result.animationTime).toBeTruthy();
    spec.completed();
  });

  this.describe("Nested Models")(function(){

    this.beforeEach(function(){
      this.registry.singleNestedObject = {
        _className      : "ParentModel",
        snake_attribute : true,
        child           : {
          _className : "ChildModel",
          snake_attribute : true
        }
      };

      this.registry.multiNestedObject = {
        _className      : "ParentModel",
        snake_attribute : true,
        children        : [
          {
            _className : "ChildModel",
            snake_attribute : true
          },
          {
            _className : "ChildModel",
            snake_attribute : true
          }
        ]
      };

      this.registry.multiNonClassNameNestedObject = {
        snake_attribute : true,
        child           : {
          _className : "ChildModel",
          snake_attribute : true
        }
      };
    });

    this.specify("should return instance of ParentModel with a child instance of ChildModel")(function(spec) {
      var result = instantiator.instantiateResult(this.registry.singleNestedObject);
      spec.assert(result.constructor.className).toEqual(Argon.TestModel.ParentModel.className);
      spec.assert(result.child).toBeTruthy();
      spec.assert(result.child.constructor.className).toEqual(Argon.TestModel.ChildModel.className);
      spec.completed();
    });

    this.specify("should return instance of some Model with many children instances of ChildModel")(function(spec) {
      var result = instantiator.instantiateResult(this.registry.multiNestedObject);
      spec.assert(result.children).toBeTruthy();
      spec.assert(result.children[0].constructor.className).toEqual(Argon.TestModel.ChildModel.className);
      spec.completed();
    });

    this.specify("should return plain object with child instance of ChildModel")(function(spec) {
      var result = instantiator.instantiateResult(this.registry.multiNonClassNameNestedObject);
      spec.assert(result.child.constructor.className).toEqual(Argon.TestModel.ChildModel.className);
      spec.completed();
    });
  });

});

