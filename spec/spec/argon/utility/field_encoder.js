Te.suite("Field Encoder")(function(){
  
  this.specify("Encode fields should return instance of Object")(function(spec) {
    var data = {
		id : 1,
		query : {
			firstName : "John",
			lastName : "Doe"
		}
	};
	var result = PropertyEncoder.encode(data);
    spec.assert(typeof result).toEqual("object");
    spec.completed();
  });

  this.specify("Encode fields should return expected value")(function(spec) {
	var data = {
		id : 1,
		query : {
			firstName : 'John',
			lastName : 'Doe'
		}
	};
	var expected = {
		id : 1,
		query : {first_name : 'John', last_name : 'Doe'}
	};
	var result = PropertyEncoder.encode(data);
    spec.assert(JSON.stringify(result)).toEqual(JSON.stringify(expected));
    spec.completed();
  });

});

