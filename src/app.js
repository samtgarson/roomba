// document.addEventListener("touchstart", function(){}, true);

angular.module('app', [
    // App
    'ui.router',
    'templates',
    'utils',
    'breakpointApp',
    'ct.ui.router.extras',
    'ngAnimate',
    'ngSanitize',
    'states',
    'facebook',
    'services',

    // Features
    'home'
    
    // Patterns
])

    .config(function() {

    })

    .controller('appController', function ($scope) {
        var $this = this;
        this.hello = 'hello world';
        
        
    });

