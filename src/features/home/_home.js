angular.module('home', [])
    .controller('homeController', function($scope, $timeout) {
        $scope.input = '';
        $scope.error = '';
        var letters = ['N', 'S', 'E', 'W'];

        $scope.process = function() {
            try {    
                var lines = $scope.input.split('\n');


                if (lines.length > 3) {
                    // Get roomba instructions
                    var instructions = lines.splice(lines.length-1, 1)[0].split('');
                    if (instructions.length < 1) throw 'invalid instructions'; // If there's no instructions
                    // If any of the instructions aren't compass directions
                    for (var i=0; i<instructions.length; i++) {
                        if (letters.indexOf(instructions[i]) < 0) throw 'invalid instructions';
                    }
                    // Get grid size
                    var size = lines.splice(0,1)[0].split(' ');
                    if (size.length!=2 || isNaN(size[0]) || isNaN(size[1])) throw 'invalid grid size'; // If there aren't 2 lengths or they're not numbers
                    size[0] = parseInt(size[0]);
                    size[1] = parseInt(size[1]);

                    // Get initial roomba position
                    var pos = lines.splice(0,1)[0].split(' ');
                    if (pos.length!=2 || isNaN(pos[0]) || isNaN(pos[1]) || pos[0]>=size[0] || pos[1]>=size[1]) throw 'invalid initial position'; // If there aren't 2 coords or they're not numbers or they're outside the grid
                    pos = {'x': parseInt(pos[0]), 'y': parseInt(pos[1])};

                    // Get patch positions
                    var patches = lines.reduce(function(prev, current) {
                        var c = current.split(' ');
                        if (c.length != 2 || isNaN(c[0]) || isNaN(c[1])) throw "invalid patch coords"; // If there aren't 2 lengths or they're not numbers
                        prev.push({
                            'x': parseInt(c[0]),
                            'y': parseInt(c[1])
                        });
                        return prev;
                    }, []);
                    console.log(instructions);
                    console.log(size);
                    console.log(pos);
                    console.log(patches);
                } else throw 'invalid input';
            } catch (err) {
                $scope.error = err;
            }
        };
    });