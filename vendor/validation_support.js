Module("ValidationSupport")({
    validations : [],

    prototype : {
        isValid : function () {
            var i, valid, validationPassed;
            valid = true;

            for (i = 0; i < this.constructor.validations.length; i++) {
                validation = this.constructor.validations[i];
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

