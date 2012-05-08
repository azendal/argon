
Te.suite('SyncModel')(function(){
    this.beforeEach(function(){
        this.registry.ExampleModel = Class().includes(Argon.SyncModel)({
            storage : (new Argon.Storage.SyncLocal())
        });

        this.registry.ExampleModel.className = 'ExampleModel';
    });

    this.specify('Model inherit from Argon.SyncModel')(function(){
        this.assert(this.registry.ExampleModel.__includedModules.indexOf(Argon.SyncModel)).toBeGreaterThan(-1);
        this.completed();
    });

    this.specify('has a storage mechanism')(function(){
        this.assert(this.registry.ExampleModel.storage).toBeTruthy();
        this.completed();
    });

    this.specify('every model must have a spearate instance of storage')(function(){
        var Model1, Model2;

        Model1 = this.registry.ExampleModel;
        Model2 = Class().includes(Argon.SyncModel)({
            storage : (new Argon.Storage.SyncLocal())
        });

        this.registry.ExampleModel.className = 'Model2';

        this.assert(Model1.storage).not().toBe(Model2.storage);
        this.completed();
    });

    this.describe('Model operations')(function(){

        this.beforeEach(function(){
            this.registry.exampleModel  = new this.registry.ExampleModel({
                data : 'some data'
            });
        });

        this.describe('reading data from storage')(function(){

            this.beforeEach(function(){
                this.registry.ExampleModel.storage.storage = {
                    'asddsgasd' : {id : 'asddsgasd', data : 1},
                    'asdxsgasd' : {id : 'asdxsgasd', data : 2},
                    'avfskgasd' : {id : 'avfskgasd', data : 3},
                    'w29xsgasd' : {id : 'w29xsgasd', data : 4}
                };
            });

            this.afterEach(function(){
                Argon.Storage.Local.storage = {};
            });

            this.specify('retrieve data with find method')(function(spec){
                var data = this.registry.ExampleModel.find('avfskgasd');
                spec.assert(data.length).toBeGreaterThan(0);
                spec.assert(data[0].data).toEqual(3);
                spec.completed();
            });

            this.specify('retrieve data with findBy method')(function(spec){
                var data = this.registry.ExampleModel.findBy("data", 2);
                spec.assert(data.length).toBeGreaterThan(0);
                spec.assert(data[0].id).toEqual('asdxsgasd');
                spec.completed();
            });

            this.specify('retrieve data with all method')(function(spec){
                var data = this.registry.ExampleModel.all();
                spec.assert(data).toBeInstanceOf(Array);
                spec.assert(data.length).toBeGreaterThan(0);
                spec.completed();
            });
        });

        this.describe('saving data with the model')(function(){

            this.specify('saves record to storage')(function(spec){
                var data = this.registry.exampleModel.save();
                spec.assert(data.id).toBeTruthy();
                spec.completed();

            });

            this.specify('saves modifications to storage')(function(spec){
                var em, ExampleModel;

                em           = this.registry.exampleModel;
                ExampleModel = this.registry.ExampleModel;


                var data = em.save();
                em.setProperty('x', 2);
                em.save();
                var examples = ExampleModel.read({});
                spec.assert(examples[0].x).toEqual(2);
                spec.completed();
            });

            this.specify('destroy removes the instance from storage')(function(spec){
                var em, ExampleModel;

                em           = this.registry.exampleModel;
                ExampleModel = this.registry.ExampleModel;

                em.save();
                em.destroy();
                var data = ExampleModel.read({});
                spec.assert(data.length).toEqual(0);
                spec.completed();

            });

        });

        this.describe('Model event system')(function(){

            this.specify('BeforeRead event')(function(spec){
                var executedEvent;

                executedEvent = false;

                this.registry.ExampleModel.bind('beforeRead', function(){
                   executedEvent = true;
                });

                this.registry.ExampleModel.read({});
                spec.assert(executedEvent).toBe(true);
                spec.completed();
            });

            this.describe('Model validations system')(function(){
                var ValidationModel = Class().includes(Argon.SyncModel)({
                    storage : (new Argon.Storage.SyncLocal()),
                    validations : {
                        presenceOf : {
                            validate : function() {
                                return this.hasOwnProperty('data') && !!this['data'];
                            },
                            message : "Data is required"
                        }
                    }
                });

                this.specify('Validate required field data is present')(function(spec){
                  var model = new ValidationModel({data : 3});
                  spec.assert(model.isValid()).toEqual(true);
                  spec.completed();
                });

                this.specify('Should not save model without data field')(function(spec){
                  var model = new ValidationModel();
                  model.save();
                  spec.assert(model.errors[0]).toEqual("Data is required");
                  spec.completed();
                });

            });
        });

        this.describe('Model caching system')(function () {
            this.beforeEach(function () {
                this.registry.CachingModel = Class().includes(Argon.SyncModel)({
                    storage : (new Argon.Storage.SyncLocal())
                });
                this.registry.CachingModel.storage.storage = {
                    'asddsgasd' : {id : 'asddsgasd', data : 1},
                    'asdxsgasd' : {id : 'asdxsgasd', data : 2},
                    'avfskgasd' : {id : 'avfskgasd', data : 3},
                    'w29xsgasd' : {id : 'w29xsgasd', data : 4}
                };
                var data = this.registry.CachingModel.all();
                this.registry.CachingModel._cache.all = {data : "all cached!", cachedAt : (new Date())};
                this.registry.CachingModel._cache.find_asddsgasd = {data : "find cached!", cachedAt : (new Date())};
                this.registry.CachingModel._cache.findBy_id_asddsgasd = {data : "findBy cached!", cachedAt : (new Date())};
            });

            this.specify('Should read all from cache')(function (spec) {
                var data = this.registry.CachingModel.all();
                spec.assert(data).toEqual("all cached!");
                spec.completed();
            });

            this.specify('Should find from cache')(function (spec) {
                var data = this.registry.CachingModel.find('asddsgasd');
                spec.assert(data).toEqual("find cached!");
                spec.completed();
            });


            this.specify('Should findBy from cache')(function (spec) {
                var data = this.registry.CachingModel.findBy('id','asddsgasd');
                spec.assert(data).toEqual("findBy cached!");
                spec.completed();
            });
        });
    });
});

