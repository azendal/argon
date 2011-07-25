Module("ValidationSupport")({
    validations : null,

    prototype : {
        isValid : function () {
            var valid, validationPassed, validations;
            valid = true;
            validations = this.constructor.validations;
            
            if(!this.hasOwnProperty('errors')) {
                this.errors = [];
            }

            for (var validation in validations) {
                if (validations.hasOwnProperty(validation)) {
                    validationPassed = validations[validation].validate.apply(this);
                    if (!validationPassed) {
                        this.errors.push(validations[validation].message);
                        valid = false;
                    }
                }
            }
            return valid;
        }
    }
});

