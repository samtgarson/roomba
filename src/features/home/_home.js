angular.module('home', [])
    .controller('homeController', function($scope, $timeout, Instructions, $state) {
        $scope.input = '';
        $scope.error = '';
        var letters = ['N', 'S', 'E', 'W'];

        $scope.process = function() {
            try {    
                var lines = $scope.input.split('\n');
                
                if (lines.length > 3) {
                    // Get roomba instructions
                    var directions = lines.splice(lines.length-1, 1)[0].split('');
                    if (directions.length < 1) throw 'invalid directions'; // If there's no instructions
                    // If any of the instructions aren't compass directions
                    for (var i=0; i<directions.length; i++) {
                        if (letters.indexOf(directions[i]) < 0) throw 'invalid directions';
                    }
                    // Get grid size
                    var size = lines.splice(0,1)[0].split(' ');
                    if (size.length!=2 || isNaN(size[0]) || isNaN(size[1]) || size[0]+size[1]<2) throw 'invalid grid size'; // If there aren't 2 lengths or they're not numbers
                    size[0] = parseInt(size[0]);
                    size[1] = parseInt(size[1]);

                    // Get initial roomba position
                    var pos = lines.splice(0,1)[0].split(' ');
                    if (pos.length!=2 || isNaN(pos[0]) || isNaN(pos[1]) || pos[0]>=size[0] || pos[1]>=size[1]) throw 'invalid initial position'; // If there aren't 2 coords or they're not numbers or they're outside the grid
                    pos = {'x': parseInt(pos[0]), 'y': parseInt(pos[1])};

                    // Get patch positions
                    var patches = lines.reduce(function(prev, current) { // Format remaining lines into array of patches
                        var c = current.split(' ');
                        if (c.length != 2 || isNaN(c[0]) || isNaN(c[1])) throw "invalid patch coords"; // If there aren't 2 lengths or they're not numbers
                        if (c[0] >= size[0] || c[0] < 0 || c[1] >= size[1] || c[1] < 0) throw 'patch coords outside grid';
                        prev.push({
                            'x': parseInt(c[0]),
                            'y': parseInt(c[1])
                        });
                        return prev;
                    }, []);

                    Instructions.set({
                        'directions': directions,
                        'size': size,
                        'pos': pos,
                        'patches': patches
                    });
                    $state.go('grid');
                } else throw 'invalid input';
            } catch (err) {
                $scope.error = err;
            }
        };
    });