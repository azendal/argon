if(typeof require !== 'undefined') {
    require('../tellurium');
}

Tellurium.suite('Tellurium')(function() {

    this.describe('not taking any action')(function () {

    });

    this.describe('specs')(function() {
        this.specify('come up as pending')();

        this.specify('a failing test')(function() {
            this.assert(1).toBe(2);
            this.completed();
        });

        this.specify('use of sync').sync()(function() {
            this.assert(1).toEqual(1);
        });

        this.specify('an async test')(function() {
            var spec = this;
            setTimeout(function() {
                spec.assert(1).toBe(1);
                spec.completed();
            }, 200);
        });

        this.specify('another async test')(function() {
            var spec = this;
            setTimeout(function() {
                spec.assert(1).toBe(1);
                spec.completed();
            }, 100);
        });

        this.specify('usage of not')(function() {
            this.assert(1).not().toBe(2);
            this.completed();
        });

        this.specify('spy on an object syntax')(function () {
            var object = {
                spied : function() {
                    return 'spied';
                }
            };

            var spy    = this.spy().on(object).method('spied');
            var result = object.spied();

            this.assert(spy).toBeCalled();
            this.assert(result).toEqual('spied');
            this.completed();
        });

        this.specify('spec assertions must be equal to assertion run')(function() {
            this.assert(this.assertions.length).toBe(0);
            this.assert(this.assertions.length).toBe(1);
            this.completed();
        });

        this.specify('stub a method on an object')(function() {
            var x = {
                stubed : function() {
                    return 'original';
                }
            };

            this.stub().method('stubed').on(x).using(function() {
                return 'stubed';
            });

            var result = x.stubed();

            this.assert(result).toBe('stubed');
            this.completed();
        });

        this.specify('mock an object')(function () {
            var mocked = this.mock();
            this.assert(typeof mocked).toEqual('object');
            this.completed();
        });
    });

    this.describe('basic matchers')(function() {

        this.beforeEach(function(description, spec) {

            spec.registry.arr = [];
            spec.registry.obj = {};
            spec.registry.fn = function() {};
            spec.registry.num = 1;
            spec.registry.str = 'x';
            spec.registry.reg = /x/;

            spec.registry.arr2 = [];
            spec.registry.obj2 = {};
            spec.registry.fn2 = function() {};
            spec.registry.num2 = 1;
            spec.registry.str2 = 'x';
            spec.registry.reg2 = /x/;
        });

        this.describe('beTruthy matcher')(function() {
            this.specify('must work')(function() {
                this.assert(1).toBeTruthy();
                this.completed();
            });
        });

        this.describe('be Matcher')(function() {

            this.specify('Array1 is identical to Array1')(function() {
                this.assert(this.registry.arr).toBe(this.registry.arr);
                this.completed();
            });

            this.specify('Object1 is identical to Object1')(function() {
                this.assert(this.registry.obj).toBe(this.registry.obj);
                this.completed();
            });

            this.specify('Function1 is identical to Object1')(function() {
                this.assert(this.registry.fn).toBe(this.registry.fn);
                this.completed();
            });

            this.specify('Number1 is identical to Number1')(function() {
                this.assert(this.registry.num).toBe(this.registry.num);
                this.completed();
            });

            this.specify('Number1 is identical to Number2 if both have the same value')(function() {
                this.assert(this.registry.num).toBe(this.registry.num2);
                this.completed();
            });

            this.specify('String1 is identical to String1')(function() {
                this.assert(this.registry.str).toBe(this.registry.str);
                this.completed();
            });

            this.specify('String1 is identical to String2 if both have the same value')(function() {
                this.assert(this.registry.str).toBe(this.registry.str2);
                this.completed();
            });

            this.specify('RegExp1 is identical to RegExp1')(function() {
                this.assert(this.registry.reg).toBe(this.registry.reg);
                this.completed();
            });

            this.specify('Boolean is identical to Boolean if both have the same value')(function() {
                this.assert(true).toBe(true);
                this.completed();
            });

            this.specify('undefined is identical to undefined no matter how you get it')(function() {
                this.assert(global.undefined1).toBe(global.undefined2);
                this.completed();
            });

        });

        this.describe('throw Matchers')(function() {
            this.specify('a thrown error is catched and matched against expected')(function() {
                this.assert(function() { throw 'catch-this'; }).toThrowError('catch-this');
                this.completed();
            });
            this.specify('a function that does not throw an error')(function() {
                this.assert(function() {
                    return "don't throw error";
                }).toNotThrowError();
                this.completed();
            });
        });

    });

    this.describe('usage of setup')(function () {

        this.setup(function () {
            var setup = this;
            setTimeout(function () {
                global.setupRan = true;
                setup.completed();
            }, 100);
        });

        this.tearDown(function () {
            var tearDown = this;
            setTimeout(function () {
                delete global.setupRan;
                tearDown.completed();
            }, 100);
        });

        this.specify('necesary matcher')(function () {
            this.assert(global.setupRan).toBe(true).withLabel('global.setupRan must be true: ');
            this.completed();
        });
    });

});

Tellurium.run();