Te.suite('Argon Interface')(function() {
    
    this.specify("has Storage")(function() {
        this.assert(Argon.hasOwnProperty('Storage')).toBe(true);
        this.completed();
    });

    this.specify("has Model")(function() {
        this.assert(Argon.hasOwnProperty('Model')).toBe(true);
        this.completed();
    });

    this.specify('Storage')(function(){
        this.assert(Argon.Storage.hasOwnProperty('Local')).toBe(true);
        this.completed();
    });

});