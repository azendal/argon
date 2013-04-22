Module("ValidationSupport")({
    validations : null,

    prototype : {
        errors : [],
        isValid : function isValid (callback) {
            var valid, validationCall, validations, results, _this;
            _this = this;
            valid = true;
            results = [];
            validations = this.constructor.validations;
            
            this.errors = [];

            if (!validations || Object.keys(validations).length === 0) {
                callback(valid);
            }

            for (var validation in validations) {
                if (validations.hasOwnProperty(validation)) {
                    validations[validation].validate.call(this, function (message) {
                        results.push(message);
                        if (message) {
                            valid = false;
                            _this.errors.push(message);
                        }
                        if (results.length === Object.keys(validations).length) {
                            callback(valid);
                        }
                    });
                }
            }
        }
    }
});
