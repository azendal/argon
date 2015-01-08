var client = require('mongodb').MongoClient,
	setupSuite;

require('neon');
require('neon/stdlib');
require('../../../../argon');
require('../../../../vendor/validation_support');
require('../../../../argon/model');
require('../../../../argon/association');
require('../../../../argon/storage');
require('../../../../argon/storage/mongodb');
require('tellurium');

var TestModel = function TestModel(config) {
	return config;
};

setupSuite = function setupSuite(db) {
	Tellurium.suite('MongoDB Storage')(function(){
		var storage = new Argon.Storage.MongoDB({
			driver : db,
			collectionName : 'test'
		});

		this.describe('create records')(function () {

			this.specify('should create a valid record')(function () {
				var spec = this;
				storage.create({data : {a : 'a'}}, function (data) {
					spec.assert(data.a).toBe('a');
					spec.completed();
				});
			});

			this.specify('should apply preprocessors')(function () {
				var spec = this;
				storage.preprocessors.push(function (data) {
					data.preprocessor = true;
					return data;
				});

				storage.create({data : {a : 'a'}}, function (data) {
					spec.assert(data.preprocessor).toBe(true);
					spec.completed();
				});
			});

			this.specify('should apply processors')(function () {
				var spec = this;
				
				storage.processors.push(function (data) {
					data.processor = true;
					return data;
				});

				storage.create({data : {a : 'a'}}, function (data) {
					spec.assert(data.processor).toBe(true);
					spec.completed();
				});
			});

		});

		this.describe('Search records')(function () {
			this.specify('should search and return matching records')(function () {
				var spec    = this,
					gusData = {name : 'Gus', surname : 'Ortiz', age : 30},
					ferData = {name : 'Azendal', surname : 'Transvina', age : 5000},
					jonData = {name : 'Jon', surname : 'Snow', age : 18};

				storage.create({model : TestModel, data : gusData}, function (gus) {
					storage.create({model : TestModel, data : ferData}, function (fer) {
						storage.create({model : TestModel, data : jonData}, function (jon) {
							storage.search({model : TestModel, query : {age : {$lt : 40}}}, function (dudes) {
								spec.assert(dudes.length).toBe(2);
								spec.assert(dudes.map(function (dude) {
									return dude.name;
								}).sort().join(',')).toBe('Gus,Jon');

								spec.completed();
							})
						});
					});
				});
			})
		});

	});
};

client.connect("mongodb://localhost:27017/argon_test", function handleConnection(error, db) {

	if (error) {
		console.log("Could not conenct to mongo");
		return;
	};

	var collection = db.collection('test');

	collection.remove({}, function (error, data) {
		setupSuite(db);
		Tellurium.run();
	});

});
