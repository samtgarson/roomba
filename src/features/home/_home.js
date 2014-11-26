angular.module('home', [])
    .controller('homeController', function($scope, $timeout) {

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
        $scope.instructions = ['E', 'N', 'E', 'E', 'E', 'E', 'E', 'E', 'N', 'W'];
        $scope.totalCleaned = 0;
        $scope.interval = 500;
        $scope.busy = false;
        var skip = false;

        $scope.currentPos = {'x': 0, 'y': 0};

        // Function to create 2D Array
        function createGrid (x, y) {
            for (var i=0,row=[];i<x;i++) row.push(0); // Create one row of 0s
            for (var j=0,grid=[];j<y;j++ ) {
                grid.push({
                    'value' : (JSON.parse(JSON.stringify(row))), // Clone row
                    'index':j // index for ng-repeat reverse ordering
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

        // Function to start simulation
        $scope.start = function start (s) {
            skip = s;
            $scope.busy = true;
            process(0);
        };

        // Process next step
        function process(step) {
            if (step != $scope.instructions.length) { // If there are more steps
                var nextStep = dir[$scope.instructions[step]]; // Translate next vector into coordinate deltas
                
                // Calculate new position based on next instruction
                var newPos = {
                    'x' : $scope.currentPos.x + nextStep.x,
                    'y' : $scope.currentPos.y + nextStep.y
                };

                // Check Roomba isn't against a wall
                if (newPos.x < $scope.grid[0].value.length && newPos.y < $scope.grid.length) { 
                    $scope.currentPos = newPos;

                    if ($scope.grid[$scope.currentPos.y].value[$scope.currentPos.x]) { // if the current cell is dirty (==1)
                        $scope.totalCleaned ++; // increase counter
                    }
                    $scope.grid[$scope.currentPos.y].value[$scope.currentPos.x] = 1; // clean it

                    if (!skip) updateUI(); // Update UI
                    $timeout(function() { // Wait for UI animation
                        process(step+1); // Then process next instruction
                    }, skip?0:$scope.interval);
                } else process(step+1);
            } else finish();
        }

        // Finsih and display
        function finish () {
            $scope.busy = false;
            alert('Final Position: (' + $scope.currentPos.x + ', ' + $scope.currentPos.y + ')\nTotal Patches Cleaned: ' +  $scope.totalCleaned);
            updateUI(); // Update UI
        }

        // Function to Update Roomba's position in the UI
        function updateUI() {
            var css = {
                width: 100 / $scope.grid[0].value.length + '%', 
                height: 100/$scope.grid.length + '%', 
                transform: 'translateX(' + $scope.currentPos.x*100 + '%) translateY(-' + $scope.currentPos.y*100 + '%)'
            };
            $('.roomba').css(css);
        }


        // TEST SETUP
        var emptyGrid = createGrid(5, 5),
        patches = [
            {'x': 1, 'y': 3},
            {'x': 3, 'y': 1},
            {'x': 4, 'y': 4}
        ];
        $scope.grid = createPatches(emptyGrid, patches);
        updateUI();
    });