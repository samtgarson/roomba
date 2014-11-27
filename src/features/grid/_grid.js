angular.module('grid', [])
    .controller('gridController', function($scope, $timeout, instructions, $state, Instructions) {
          
        // Translation hash from compass direction to coordinate vectors
        var dir = {
            'N': {'x':0, 'y':1},
            'S': {'x':0, 'y':-1},
            'E': {'x':1, 'y':0},
            'W': {'x':-1, 'y':0}
        };

        // Initiate starting variables
        $scope.grid = [];
        $scope.patches = [];
        $scope.directions = [];
        $scope.totalCleaned = 0;
        $scope.interval = 500;
        $scope.busy = false;
        var skip = false;

        $scope.currentPos = {'x': 0, 'y': 0};

        // PUBLIC METHODS

        // Function to start simulation
        $scope.start = function (s) {
            skip = s;
            $scope.busy = true;
            process(0);
        };

        // Reset the grid and return home
        $scope.reset = function () {
            Instructions.reset();
            $state.go('home');
        };

        // PRIVATE FUNCTIONS

        // Function to create 2D Array
        function createGrid (x, y) {
            for (var i=0,row=[];i<x;i++) row.push(0); // Create one row of 0s
            for (var j=0,grid=[];j<y;j++ ) {
                grid.push({
                    'value' : (JSON.parse(JSON.stringify(row))), // Clone row
                    'index':parseInt(j) // index for ng-repeat reverse ordering
                });
            }
            return grid;
        }

        // Function to insert patches into grid
        function createPatches (grid, patches) {
            for (var i=0;i<patches.length;i++) { // for each patch
                grid[patches[i].y].value[patches[i].x] = 2; // set the correct cell
            }
            return grid;
        }

        // Process next step
        function process(step) {
            if (step != $scope.directions.length) { // If there are more steps
                var nextStep = dir[$scope.directions[step]]; // Translate next vector into coordinate deltas
                
                // Calculate new position based on next instruction
                var newPos = {
                    'x' : $scope.currentPos.x + nextStep.x,
                    'y' : $scope.currentPos.y + nextStep.y
                };

                // Check Roomba isn't against a wall
                if (newPos.x < $scope.grid[0].value.length && newPos.y < $scope.grid.length && newPos.x >= 0 && newPos.y >= 0) { 
                    $scope.currentPos = newPos;

                    if ($scope.grid[$scope.currentPos.y].value[$scope.currentPos.x] > 1) { // if the current cell is dirty (==2)
                        $scope.totalCleaned ++; // increase counter
                    }
                    $scope.grid[$scope.currentPos.y].value[$scope.currentPos.x] = 1; // clean it, mark it as visited (==1)

                    if (!skip) updateUI(); // Update UI
                    $timeout(function() { // Wait for UI animation
                        process(step+1); // Then process next instruction
                    }, skip?0:$scope.interval); // Only wait if we're not in a hurry
                } else process(step+1); // The roomba skids against the wall, process the next step
            } else finish();
        }

        // Finsih and display
        function finish () {
            $scope.busy = false; // Enable buttons
            console.log($scope.currentPos.x, $scope.currentPos.y); // Log results
            console.log($scope.totalCleaned);
            alert('Final Position: (' + $scope.currentPos.x + ', ' + $scope.currentPos.y + ')\nTotal Patches Cleaned: ' +  $scope.totalCleaned); // Alert results
            updateUI(); // Update UI
            $scope.done = true;
            $scope.totalCleaned = 0; // Reset for next time
        }

        // Function to Update Roomba's position in the UI
        function updateUI(size) {
            var css = {
                transform: 'translateX(' + $scope.currentPos.x*100 + '%) translateY(-' + $scope.currentPos.y*100 + '%)'
            };
            if (size) {
                css.width = 100 / $scope.grid[0].value.length + '%';
                css.height = 100/$scope.grid.length + '%';
            }
            $('.roomba').css(css);
        }


        function init () {
            if (!('size' in instructions)) $scope.reset();
            else {
                var emptyGrid = createGrid(instructions.size[0], instructions.size[1]), // Make the empty grid
                patches = instructions.patches;

                $scope.grid = createPatches(emptyGrid, patches); // Fill the grid with dirty patches
                $scope.currentPos = instructions.pos; // Set the init position of Roomba
                $scope.directions = instructions.directions; // Set the list of directions

                $scope.grid[$scope.currentPos.y].value[$scope.currentPos.x] = 1; // clean it

                updateUI(1);
            }
        }

        init(); // Get the data
    });