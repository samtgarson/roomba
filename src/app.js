// document.addEventListener("touchstart", function(){}, true);

angular.module('app', [
    // App
    'ui.router',
    'templates',
    'breakpointApp',
    'ngAnimate',
    'ngSanitize',
    'states',
    // 'facebook',
    'services',

    // Features
    'home',
    'grid'
    
    // Patterns
])

    // .config(function() {

    // })

    .controller('appController', function ($scope) {
        var $this = this;    
    });

