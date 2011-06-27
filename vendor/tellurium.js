Module('Tellurium')({
    children          : [],
    completedChildren : [],
    isCompleted       : false,
    reporter          : null,
    suite             : function (description) {
        var factory = function (code) {
            var suite = new Tellurium.Suite(description, code);
            suite.setParent(Tellurium);
            Tellurium.children.push(suite);
            return suite;
        };

        return factory;
    },
    run               : function () {
        var i;
        
        if (this.reporter === null) {
            this.reporter = new Tellurium.Reporter.Firebug();
        }
        
        console.time('run');

        for (i = 0; i < this.children.length; i++) {
            this.children[i].run();
        }

        return this;
    },
    childCompleted    : function (child) {
        this.completedChildren.push(child);

        if (this.children.length === this.completedChildren.length) {
            this.completed();
        }

        return this;
    },
    completed         : function () {
        this.isCompleted = true;
        console.timeEnd('run');
        this.reporter.run();
        return this;
    }
});

var Te = Tellurium;

Class(Tellurium, 'Stub')({
    prototype : {
        targetObject   : null,
        methodName     : null,
        newMethod      : null,
        originalMethod : null,
        init           : function (config) {
            config = config || {};
            
            this.targetObject   = config.targetObject;
            this.methodName     = config.methodName;
            this.newMethod      = config.newMethod;
        },
        applyStub      : function () {
            this.originalMethod = this.targetObject[this.methodName];
            this.targetObject[this.methodName] = this.newMethod;
            return this;
        },
        removeStub     : function () {
            this.targetObject[this.methodName] = this.originalMethod;
            return this;
        },
        on             : function (targetObject) {
            this.targetObject = targetObject;
            return this;
        },
        method         : function (methodName) {
            this.methodName = methodName;
            return this;
        },
        using          : function (newMethod) {
            this.newMethod = newMethod;
            this.applyStub();
            return this;
        }
    }
});

Module(Tellurium.Stub, 'Factory')({
    prototype : {
        stubs      : null,
        stub       : function () {
            var stub = new Tellurium.Stub();
            this.stubs = this.stubs || [];
            this.stubs.push(stub);
            return stub;
        },
        cleanStubs : function () {
            var i;
            
            for (i = 0; i < this.stubs.length; i++) {
                this.stubs[i].removeStub();
            }
            
            return this;
        }
    }
});

Class(Tellurium, 'Spy')({
    prototype : {
        targetObject   : null,
        methodName     : null,
        spyMethod      : null,
        originalMethod : null,
        called         : null,
        init           : function (config) {
            config = config || {};
            
            this.called         = [];
            this.targetObject   = config.targetObject;
            this.methodName     = config.methodName;
        },
        applySpy       : function () {
            var spy;
            
            spy = this;
            this.originalMethod = this.targetObject[this.methodName];
            this.targetObject[this.methodName] = function () {
                var args;
                args = Array.prototype.slice.call(arguments, 0, arguments.length);
                spy.called.push(args);
                return spy.originalMethod.apply(spy.targetObject, args);
            };
            return this;
        },
        removeSpy      : function () {
            this.targetObject[this.methodName] = this.originalMethod;
            return this;
        },
        on             : function (targetObject) {
            this.targetObject = targetObject;
            return this;
        },
        method         : function (methodName) {
            this.methodName = methodName;
            this.applySpy();
            return this;
        }
    }
});

Module(Tellurium.Spy, 'Factory')({
    prototype : {
        spies      : null,
        spy        : function () {
            var spy = new Tellurium.Spy();
            this.spies = this.spies || [];
            this.spies.push(spy);
            return spy;
        },
        cleanSpies : function () {
            var i;
            
            for (i = 0; i < this.spies.length; i++) {
                this.spies[i].removeSpy();
            }
            
            return this;
        }
    }
});

Class(Tellurium, 'Assertion')({
    includeAssertions : function (assertions) {
        var assertion;
        for (assertion in assertions) {
            if (assertions.hasOwnProperty(assertion)) {
                this.prototype.addAssert(assertion, assertions[assertion]);
            }
        }
        
        return this;
    },
    prototype : {
        TYPE_TRUE         : 'TYPE_TRUE',
        TYPE_FALSE        : 'TYPE_FALSE',
        STATUS_FAIL       : 'STATUS_FAIL',
        STATUS_SUCCESS    : 'STATUS_SUCCESS',
        actual            : null,
        expected          : null,
        spec              : null,
        status            : null,
        type              : null,
        init              : function (actual, spec) {
            this.type   = this.TYPE_TRUE;
            this.actual = actual;
            this.spec   = spec;
        },
        not               : function () {
            this.type = this.TYPE_FALSE;
            return this;
        },
        notify            : function (assertResult) {
            if( assertResult === true) {
                if (this.type === this.TYPE_FALSE) {
                    this.status = this.STATUS_FAIL;
                    this.spec.assertionFailed(this);
                }
                else {
                    this.status = this.STATUS_SUCCESS;
                    this.spec.assertionPassed(this);
                }
            } else {
                if (this.type === this.TYPE_FALSE) {
                    this.status = this.STATUS_SUCCESS;
                    this.spec.assertionPassed(this);
                }
                else {
                    this.status = this.STATUS_FAIL;
                    this.spec.assertionFailed(this);
                }
            }
            
            return this;
        },
        addAssert         : function (name, assertFn) {
            this[name] = function () {
                var args;
                
                args = Array.prototype.slice.call(arguments, 0, arguments.length);
                this.invoqued = name;
                this.expected = args;
                this.notify(assertFn.apply(this, args));
                return null;
            };
            
            return this;
        }
    }
});

Tellurium.Assertion.includeAssertions({
    toBe            : function (expected) {
        return (this.actual === expected);
    },
    toEqual         : function (expected) {
        return (this.actual == expected);
    },
    toMatch         : function (expected) {
        return (expected.test(this.actual) === true);
    },
    toBeDefined     : function () {
        return (typeof this.actual !== 'undefined');
    },
    toBeNull        : function () {
        return (this.actual === null);
    },
    toBeTruthy      : function () {
        return ((this.actual) ? true : false);
    },
    toBeCalled      : function () {
        return (this.actual.called.length > 0);
    },
    toBeCalledWith  : function (expected) {
        return (this.actual.called[0] === expected);
    },
    toBeGreaterThan : function (expected) {
        return (this.actual > expected);
    },
    toBeLessThan    : function (expected) {
        return (this.actual < expected);
    },
    toBeInstanceOf  : function (expected) {
        return (this.actual.constructor === expected);
    }
});

Module(Tellurium, 'Context')({
    prototype : {
        registry          : null,
        description       : null,
        code              : null,
        parent            : null,
        children          : null,
        completedChildren : null,
        beforeEachPool    : null,
        afterEachPool     : null,
        isCompleted       : null,
        init              : function (description, code) {
            this.registry          = [];
            this.description       = description;
            this.code              = code;
            this.children          = [];
            this.completedChildren = [];
            this.beforeEachPool    = [];
            this.afterEachPool     = [];
            this.isCompleted       = false;
        },
        appendChild       : function (child) {
            if (child.parent) {
                child.parent.removeChild(child);
            }

            this.children.push(child);
            child.setParent(this);

            return child;
        },
        setParent         : function (parent) {
            this.parent = parent;

            return this;
        },
        describe          : function (description) {
            var current = this;

            return function (code) {
                var describe = new Tellurium.Description(description, code);
                current.appendChild(describe);
            };
        },
        specify           : function (description){
            var type;
            var current = this;
            var fn = function (code) {
                var specification = new Tellurium.Specification(description, code, type);
                current.appendChild(specification);
            };
            
            fn.sync = function(){
                type = Tellurium.Specification.prototype.TYPE_SYNC;
                return fn;
            };
            
            return fn;
        },
        setup             : function (code) { console.log('setup not implemented') },
        teardown          : function (code) { console.log('teardown not implemented') },
        beforeEach        : function (code) {
            this.beforeEachPool.push(code);

            return this;
        },
        afterEach         : function (code) {
            this.afterEachPool.push(code);

            return this;
        },
        run               : function () {
            var i;

            this.code.call(this, this);

            if (this.children.length === 0) {
                this.completed();
            }
            
            for (i = 0; i < this.children.length; i++) {
                if (this.children[i] instanceof Tellurium.Specification) {
                    this.runBeforeEach(this.children[i]);
                }
                this.children[i].run();
            }

            return this;
        },
        runBeforeEach     : function (context) {
            var i;
            
            context = context || this;

            if (this.parent && this.parent.runBeforeEach) {
                this.parent.runBeforeEach(context);
            }

            for (i = 0; i < this.beforeEachPool.length; i++) {
                this.beforeEachPool[i].call(context, context);
            }

            return this;
        },
        runAfterEach      : function (context) {
            var i;
            
            context = context || this;

            if (this.parent && this.parent.runAfterEach) {
                this.parent.runAfterEach(context);
            }

            for (i = 0; i < this.afterEachPool.length; i++) {
                this.afterEachPool[i].call(context, context);
            }

            return this;
        },
        childCompleted    : function (child) {
            this.completedChildren.push(child);

            if (child instanceof Tellurium.Specification) {
                this.runAfterEach(child);
            }

            if (this.children.length === this.completedChildren.length) {
                this.completed();
            }

            return this;
        },
        completed         : function () {
            this.isCompleted = true;
            
            if (this.spies) {
                this.cleanSpies();
            }
            
            if (this.stubs) {
                this.cleanStubs();
            }
            
            if (this.parent) {
                this.parent.childCompleted(this);
            }

            return this;
        }
    }
});

Class(Tellurium, 'Suite').includes(Tellurium.Context, Tellurium.Stub.Factory, Tellurium.Spy.Factory)({});

Class(Tellurium, 'Description').includes(Tellurium.Context, Tellurium.Stub.Factory, Tellurium.Spy.Factory)({});

Class(Tellurium, 'Specification').includes(Tellurium.Stub.Factory, Tellurium.Spy.Factory)({
    prototype : {
        STATUS_PENDING  : 'STATUS_PENDING',
        STATUS_FAIL     : 'STATUS_FAIL',
        STATUS_SUCCESS  : 'STATUS_SUCCESS',
        TYPE_ASYNC      : 'TYPE_ASYNC',
        TYPE_SYNC       : 'TYPE_SYNC',
        type            : null,
        description     : null,
        code            : null,
        parent          : null,
        assertions      : null,
        registry        : null,
        status          : null,
        isCompleted     : null,
        init            : function (description, code, type) {
            this.description = description;
            this.code        = code;
            this.type        = type || this.TYPE_ASYNC;
            this.registry    = {};
            this.assertions  = [];
            this.isCompleted = false;
        },
        setParent       : function (parent) {
            this.parent = parent;
            return this;
        },
        run             : function () {
            if (this.code) {
                this.code.call(this, this);
                if(this.type == this.TYPE_SYNC){
                    this.completed();
                }
            }
            else {
                this.pendant();
            }
        },
        pendant         : function () {
            this.status = this.STATUS_PENDING;
            this.completed();  
        },
        assertionPassed : function (assertion) {
            if (this.status !== this.STATUS_FAIL) {
                this.status = this.STATUS_SUCCESS;
            }

            return this;
        },
        assertionFailed : function (assertion) {
            this.status = this.STATUS_FAIL;

            return this;
        },
        assert          : function (actual) {
            var assertion = new Tellurium.Assertion(actual, this);
            this.assertions.push(assertion);
            return assertion;
        },
        mock            : function () {
            return {};
        },
        completed       : function () {
            
            this.isCompleted = true;
            
            if (this.spies) {
                this.cleanSpies();
            }
            
            if (this.stubs) {
                this.cleanStubs();
            }
            
            if(this.status === null){
                this.status = this.STATUS_SUCCESS;
            }
            
            this.parent.childCompleted(this);

            return this;
        }
    }
});

Tellurium.Reporter = {};

Class(Tellurium.Reporter, 'Firebug')({
    prototype : {
        init          : function () {
            this.totalSpecs   = 0;
            this.failedSpecs  = 0;
            this.passedSpecs  = 0;
            this.pendantSpecs = 0;
        },
        run           : function () {
            console.log('Tellurium Test Results');
            for (var i=0; i < Tellurium.children.length; i++) {
                this.suite(Tellurium.children[i]);
            };
            console.info('Total: ', this.totalSpecs);
            console.info('Passed: ', this.passedSpecs);
            console.info('Failed: ', this.failedSpecs);
            console.warn('Pending: ', this.pendantSpecs);
            console.log('End');
        },
        suite         : function (suite) {
            console.groupCollapsed(suite.description);
            
            for (var i=0; i < suite.children.length; i++) {
                if(suite.children[i] instanceof Tellurium.Description){
                    this.description(suite.children[i]);
                }
                else if(suite.children[i] instanceof Tellurium.Specification){
                    this.specification(suite.children[i]);
                }
            }
            
            console.groupEnd(suite.description);
        },
        description   : function (description) {
            console.group(description.description);
            
            for (var i=0; i < description.children.length; i++) {
                if(description.children[i] instanceof Tellurium.Description){
                    this.description(description.children[i]);
                }
                else if(description.children[i] instanceof Tellurium.Specification){
                    this.specification(description.children[i]);
                }
            };
            
            console.groupEnd(description.description);
        },
        specification : function (specification) {
            this.totalSpecs = this.totalSpecs + 1;
            if(specification.status == specification.STATUS_FAIL) {
                this.failedSpecs = this.failedSpecs + 1;
                console.error(specification.description, '');
            }
            else if( specification.status == specification.STATUS_SUCCESS ){
                this.passedSpecs = this.passedSpecs + 1;
                console.info(specification.description, '');
            }
            else if( specification.status == specification.STATUS_PENDING ){
                this.pendantSpecs = this.pendantSpecs + 1;
                console.warn(specification.description, '');
            }
            
            console.groupCollapsed('assertions');
            for (var i=0; i < specification.assertions.length; i++) {
                this.assertion(specification.assertions[i]);
            };
            console.groupEnd('assertions');
            
        },
        assertion     : function (assertion) {

            if(assertion.status == assertion.STATUS_SUCCESS){
                console.info(assertion.actual, ' ', assertion.invoqued, ' ', (assertion.expected) ? assertion.expected : '')
            }
            else if(assertion.status == assertion.STATUS_FAIL){
                console.info(assertion.actual, ' ', assertion.invoqued, ' ', (assertion.expected) ? assertion.expected : '')
            }
        }
    }
});