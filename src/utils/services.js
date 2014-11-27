angular.module('services', [])
    .service('Instructions', function() {
        // Service to store the current instructions
        var obj = {};
        
        this.set = function(newObj) {
            obj = newObj;
        };

        this.get = function() {
            return obj;
        };

        this.reset = function () {
            obj = {};
        };

        return this;
    });