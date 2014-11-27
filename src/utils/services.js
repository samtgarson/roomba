angular.module('services', [])
    .service('Instructions', function() {
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