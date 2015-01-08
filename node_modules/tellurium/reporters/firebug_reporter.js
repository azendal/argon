if(typeof require !== 'undefined') {
    require('../Tellurium');
}

Class('FirebugReporter')({
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

        run : function (suite) {
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

        suite : function (suite) {
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

        description : function (description) {
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

        assertion : function (assertion) {
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