Module("ValidationSupport")({
    validations : [],

    prototype : {
        isValid : function () {
            var valid, validationPassed;
            valid = true;

            for (var validation in this.constructor.validations) {
                if (this.constructor.validations.hasOwnProperty(validation)) {
                    validationPassed = this.constructor.validations[validation].validate.apply(this);
                    if (!validationPassed) {
                        this.errors.push(this.constructor.validations[validation].message);
                        valid = false;
                    }
                }
            }
            return valid;
        }
    }
});

