var Te = Module('Tellurium')({
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
    run               : function (ids) {
        var i, j, id;

        this.completedChildren = [];
        this.isCompleted       = false;

        if (typeof ids === 'string') {
            ids = [ids];
        }

        if (ids) {
            for (j = 0; j < ids.length; j += 1) {
                id = ids[j];
                for (i = 0; i < this.children.length; i += 1) {
                    if (this.children[i].description === id) {
                        console.time('run ' + this.children[i].description);
                        this.children[i].run();
                    }
                }
            }
        } else {
            console.time('run all');
            for (i = 0; i < this.children.length; i += 1) {
                Tellurium.children[i].run();
            }
        }

        return this;
    },
    childCompleted    : function (child) {
        this.completedChildren.push(child);

        if (this.reporter === null) {
            this.reporter = new Tellurium.Reporter.Firebug();
        }
        console.timeEnd('run ' + child.description);
        this.reporter.run(child);

        if (this.children.length === this.completedChildren.length) {
            this.completed();
        }

        return this;
    },
    completed         : function () {
        this.isCompleted = true;
        console.timeEnd('run all');
        return this;
    }
});

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

            for (i = 0; i < this.stubs.length; i += 1) {
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
        objectHasMethod : null,
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
            if (this.targetObject.hasOwnProperty(this.methodName) === false) {
                this.objectHasMethod = false;
            } 
            else {
                this.objectHasMethod = true;
            }
            
            this.originalMethod = this.targetObject[this.methodName];

            this.targetObject[this.methodName] = function () {
                var args, result;
                args = Array.prototype.slice.call(arguments, 0, arguments.length);
                var scope = this;
                
                if (this === spy) {
                    scope = spy.targetObject;
                }
                
                var startTime = Date.now();
                result = spy.originalMethod.apply(scope, args);
                var endTime = Date.now();

                spy.called.push({
                    arguments : args,
                    returned : result,
                    time     : endTime - startTime
                });
                return result;
            };
            return this;
        },
        removeSpy      : function () {
            if (this.objectHasMethod === true) {
                this.targetObject[this.methodName] = this.originalMethod;
            }
            else {
                delete this.targetObject[this.methodName];
            }
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

            for (i = 0; i < this.spies.length; i += 1) {
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
        label             : null,
        init              : function (actual, spec) {
            this.type   = this.TYPE_TRUE;
            this.actual = actual;
            this.spec   = spec;
        },
        withLabel         : function (label) {
            this.label = label;
            return this;
        },
        not               : function () {
            this.type = this.TYPE_FALSE;
            return this;
        },
        notify            : function (assertResult) {
            if (assertResult === true) {
                if (this.type === this.TYPE_FALSE) {
                    this.status = this.STATUS_FAIL;
                    this.spec.assertionFailed(this);
                } else {
                    this.status = this.STATUS_SUCCESS;
                    this.spec.assertionPassed(this);
                }
            } else {
                if (this.type === this.TYPE_FALSE) {
                    this.status = this.STATUS_SUCCESS;
                    this.spec.assertionPassed(this);
                } else {
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
                return this;
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
        return (this.actual.called[0].arguments === expected);
    },
    toReturn        : function (expected) {
        return (this.actual.called[0].returned === expected);
    },
    toBeGreaterThan : function (expected) {
        return (this.actual > expected);
    },
    toBeLessThan    : function (expected) {
        return (this.actual < expected);
    },
    toBeInstanceOf  : function (expected) {
        return (this.actual.constructor === expected);
    },
    toThrowError    : function (expected) {
        try {
          this.actual();
        } catch (e) {
            if (e === expected || e.name === expected) {
                return true;
            }
        }
        return false;
    },
    toNotThrowError : function () {
        try {
            this.actual();
            return true;
        } catch (e) {
            return false;
        }
    }
});

Module(Tellurium, 'Context')({
    prototype : {
        registry            : null,
        description         : null,
        code                : null,
        parent              : null,
        children            : null,
        completedChildren   : null,
        setupCode           : null,
        tearDownCode        : null,
        beforeEachPool      : null,
        completedBeforeEach : null,
        afterEachPool       : null,
        completedAfterEach  : null,
        isCompleted         : null,
        init                : function (description, code) {
            this.registry            = [];
            this.description         = description;
            this.code                = code;
            this.children            = [];
            this.completedChildren   = [];
            this.beforeEachPool      = [];
            this.completedBeforeEach = [];
            this.completedAfterEach  = [];
            this.afterEachPool       = [];
            this.isCompleted         = false;
        },
        appendChild         : function (child) {
            if (child.parent) {
                child.parent.removeChild(child);
            }

            this.children.push(child);
            child.setParent(this);

            return child;
        },
        setParent           : function (parent) {
            this.parent = parent;

            return this;
        },
        setup               : function (code) {
            this.setupCode = new Tellurium.Executable(code);
            return this;
        },
        tearDown            : function (code) {
            this.tearDownCode = new Tellurium.Executable(code);
            return this;
        },
        describe            : function (description) {
            var current, fn, guided;

            current = this;

            fn = function (code) {
                var describe = new Tellurium.Description(description, code);

                if (guided === true) {
                    describe.guided = true;
                    var index = 0;
                    describe.run = function () {
                        this.code.call(this, this);

                        if (this.children.length === 0) {
                            this.completed();
                        }

                        if (this.setupCode) {
                            this.setupCode.run();
                        }

                        if (this.children[index] instanceof Tellurium.Specification) {
                            this.runBeforeEach(this, this.children[index]);
                        }

                        this.children[index].run();

                        return this;
                    };

                    describe.childCompleted = function (child) {
                        this.completedChildren.push(child);

                        if (child instanceof Tellurium.Specification) {
                            this.runAfterEach(child);
                        }

                        if (this.children.length === this.completedChildren.length) {
                            this.completed();
                        } else {
                            index = index + 1;
                            if (this.children[index] instanceof Tellurium.Specification) {
                                this.runBeforeEach(this, this.children[index]);
                            }
                            this.children[index].run();
                        }

                        return this;
                    };
                } else {
                    describe.guided = false;
                }

                current.appendChild(describe);

                return current;
            };

            fn.guided = function () {
                guided = true;
                return fn;
            };

            return fn;
        },
        specify             : function (description) {
            var current = this;
            var sync    = false;
            var fn      = function (code) {
                var specification = new Tellurium.Specification(description, code);
                specification.sync = sync;
                current.appendChild(specification);
            };

            fn.sync = function () {
                sync = true;
                return fn;
            };

            return fn;
        },
        beforeEach          : function (code) {
            this.beforeEachPool.push(code);

            return this;
        },
        afterEach           : function (code) {
            this.afterEachPool.push(code);

            return this;
        },
        run                 : function () {
            var i, context;

            context = this;
            this.children = [];
            this.completedChildren = [];

            this.code.call(this, this);

            if (this.children.length === 0) {
                this.completed();
            }

            if (this.setupCode) {
                this.setupCode.onCompleted(function () {
                    for (i = 0; i < context.children.length; i += 1) {
                        if (context.children[i] instanceof Tellurium.Specification) {
                            context.runBeforeEach(context, context.children[i]);
                        }
                        context.children[i].run();
                    }
                });
                this.setupCode.run();
            } else {
                for (i = 0; i < this.children.length; i += 1) {
                    if (this.children[i] instanceof Tellurium.Specification || this.children[i] instanceof Tellurium.Description) {
                        this.runBeforeEach(this.children[i], this);
                    }
                    this.children[i].run();
                }
            }

            return this;
        },
        runBeforeEach       : function (target, context) {
            var i;

            context = context || this;

            if (this.parent && this.parent.runBeforeEach) {
                this.parent.runBeforeEach(target, context);
            }

            for (i = 0; i < this.beforeEachPool.length; i += 1) {
                this.beforeEachPool[i].call(target, target, context);
            }

            return this;
        },
        runAfterEach        : function (target, context) {
            var i;

            context = context || this;

            if (this.parent && this.parent.runAfterEach) {
                this.parent.runAfterEach(target, context);
            }

            for (i = 0; i < this.afterEachPool.length; i += 1) {
                this.afterEachPool[i].call(target, target, context);
            }

            return this;
        },
        childCompleted      : function (child) {
            this.completedChildren.push(child);

            if (child instanceof Tellurium.Specification || child instanceof Tellurium.Description) {
                this.runAfterEach(child, this);
            }

            if (this.children.length === this.completedChildren.length) {
                this.completed();
            }

            return this;
        },
        completed           : function () {
            var context;

            context = this;

            this.isCompleted = true;

            if (this.spies) {
                this.cleanSpies();
            }

            if (this.stubs) {
                this.cleanStubs();
            }

            if (this.tearDownCode) {
                this.tearDownCode.onCompleted(function () {
                    if (context.parent) {
                        context.parent.childCompleted(context);
                    }
                });
                this.tearDownCode.run();
            } else {
                if (this.parent) {
                    this.parent.childCompleted(this);
                }
            }

            return this;
        }
    }
});

Class(Tellurium, 'Executable')({
    prototype : {
        code : null,
        isCompleted : null,
        isAsynchronous : true,
        init : function (code) {
            this.code = code;
        },
        completed : function () {
            this.isCompleted = true;
            this.onCompletedCode();
            return this;
        },
        run : function () {
            this.isCompleted = false;
            this.code.apply(this);
            return this;
        },
        onCompleted : function (code) {
            this.onCompletedCode = function () {
                code();
                return this;
            };
            return this;
        }
    }
});

Class(Tellurium, 'Suite').includes(Tellurium.Context, Tellurium.Stub.Factory, Tellurium.Spy.Factory)({});

Class(Tellurium, 'Description').includes(Tellurium.Context, Tellurium.Stub.Factory, Tellurium.Spy.Factory)({
    prototype : {
        guided : false
    }
});

Class(Tellurium, 'Specification').includes(Tellurium.Stub.Factory, Tellurium.Spy.Factory)({
    prototype : {
        STATUS_PENDING  : 'STATUS_PENDING',
        STATUS_FAIL     : 'STATUS_FAIL',
        STATUS_SUCCESS  : 'STATUS_SUCCESS',
        description     : null,
        code            : null,
        parent          : null,
        assertions      : null,
        registry        : null,
        status          : null,
        isCompleted     : null,
        sync            : false,
        init            : function (description, code) {
            this.description = description;
            this.code        = code;
            this.registry    = {};
            this.assertions  = [];
            this.spies       = [];
            this.stubs       = [];
            this.isCompleted = false;
        },
        setParent       : function (parent) {
            this.parent = parent;
            return this;
        },
        run             : function () {
            if (this.code) {
                this.code.call(this, this);
                if (this.sync === true) {
                    this.completed();
                }
            } else {
                this.pending();
            }
        },
        pending         : function () {
            this.status = this.STATUS_PENDING;
            this.completed();
        },
        assertionPassed : function () {
            if (this.status !== this.STATUS_FAIL) {
                this.status = this.STATUS_SUCCESS;
            }

            return this;
        },
        assertionFailed : function () {
            this.status = this.STATUS_FAIL;

            return this;
        },
        assert          : function (actual) {
            
            if (this.isCompleted === true) {
                throw "called assert on a completed test";
                return this;
            }
            
            var assertion = new Tellurium.Assertion(actual, this);
            this.assertions.push(assertion);
            return assertion;
        },
        mock            : function () {
            return {};
        },
        completed       : function () {

            if (this.isCompleted === true) {
                throw "called completed more than once for test";
                return this;
            }

            this.isCompleted = true;

            if (this.spies) {
                this.cleanSpies();
            }

            if (this.stubs) {
                this.cleanStubs();
            }

            if (this.status === null) {
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
        totalSpecs    : null,
        failedSpecs   : null,
        passedSpecs   : null,
        pendingSpecs  : null,
        init          : function () {
            this.totalSpecs   = 0;
            this.failedSpecs  = 0;
            this.passedSpecs  = 0;
            this.pendingSpecs = 0;
        },
        run           : function (suite) {
            console.log('Tellurium Test Results for ' + suite.description);
            this.totalSpecs   = 0;
            this.passedSpecs  = 0;
            this.failedSpecs  = 0;
            this.pendingSpecs = 0;

            this.suite(suite);
            console.info('Total: ', this.totalSpecs);
            console.info('Passed: ', this.passedSpecs);
            console.info('%cFailed: ' + this.failedSpecs, 'background-color:#FFEBEB; color : #FF2424');
            console.warn('Pending: ', this.pendingSpecs);
            console.log('End');
        },
        suite         : function (suite) {
            var i;

            console.group(suite.description);

            for (i = 0; i < suite.children.length; i += 1) {
                if (suite.children[i] instanceof Tellurium.Description) {
                    this.description(suite.children[i]);
                } else if (suite.children[i] instanceof Tellurium.Specification) {
                    this.specification(suite.children[i]);
                }
            }

            console.groupEnd(suite.description);
        },
        description   : function (description) {
            var i;
            console.group(description.description);

            for (i = 0; i < description.children.length; i += 1) {
                if (description.children[i] instanceof Tellurium.Description) {
                    this.description(description.children[i]);
                } else if (description.children[i] instanceof Tellurium.Specification) {
                    this.specification(description.children[i]);
                }
            }

            console.groupEnd(description.description);
        },
        specification : function (specification) {
            var i;

            this.totalSpecs = this.totalSpecs + 1;

            if (specification.status === specification.STATUS_FAIL) {
                this.failedSpecs = this.failedSpecs + 1;
                console.error(specification.description, '');
            } else if (specification.status === specification.STATUS_SUCCESS) {
                this.passedSpecs = this.passedSpecs + 1;
                console.info(specification.description, '');
            } else if (specification.status === specification.STATUS_PENDING) {
                this.pendingSpecs = this.pendingSpecs + 1;
                console.warn(specification.description, '');
            }

            console.groupCollapsed('assertions');
            for (i = 0; i < specification.assertions.length; i += 1) {
                this.assertion(specification.assertions[i]);
            }
            console.groupEnd('assertions');

        },
        assertion     : function (assertion) {
            var not;
            if (assertion.type === Tellurium.Assertion.prototype.TYPE_FALSE) {
                not = ' not ';
            } else {
                not = ' ';
            }

            if (assertion.status === assertion.STATUS_SUCCESS) {
                console.info(assertion.label, assertion.actual, not, assertion.invoqued, ' ', (assertion.expected) ? assertion.expected : '');
            } else if (assertion.status === assertion.STATUS_FAIL) {
                console.error(assertion.label, assertion.actual, not, assertion.invoqued, ' ', (assertion.expected) ? assertion.expected : '');
            }
        }
    }
});
