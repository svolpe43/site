
/*
 * Astar Algorithm
 */

// tracer is for the path tracer once at target
var tracer;
var targetFound = false;

// the tile for each space on the board
function Tile(x, y){
	
	// set the location
	this.x = x;
	this.y = y;

	// huerisic data 2^53 is max number value
	this.h = Number.MAX_SAFE_INTEGER;
	this.g = Number.MAX_SAFE_INTEGER;
	this.f = Number.MAX_SAFE_INTEGER;

	// parent if part of the path
	this.parent = null;

	// map details
	this.isTarget = false;
	this.isWall = false;
	this.isPath = false;

	this.onOpenList = false;
	this.onClosedList = false;
}

// updates all the hueristics for the tile given
function updateHueristics(tile, ng){
	tile.g = ng; //distance(start, tile);
	tile.h = distance(tile, target);
	tile.f = tile.g + tile.h;
}

// Tile compare function to pass to sorting
function compare(a, b){
	return a.f - b.f;
}

// get the Manhattan distance between two tiles
function distance(from, to){
	return Math.abs(from.x - to.x) + Math.abs(from.y - to.y);
}

// initialize the astar parameters
function initAstar(){
	openList = [];
	closedList =[];
	start.f = start.g = 0;
	openList.push(start);
	board[start.x][start.y].isOnOpenList = true;
	targetFound = false;
}

function iterateAstar(){
	if(openList.length > 0 && !targetFound){
		
		// sort openList by f value
		openList.sort(compare);
		
		// current should be the best Tile
		current = openList[0];

		// move current to closedList
		openList.shift();
		board[current.x][current.y].isOnOpenList = false;
		closedList.push(current);
		board[current.x][current.y].isOnClosedList = true;

		// check if we are at the target
		if(current.x == target.x && current.y == target.y){
			targetFound = true;
			tracer = board[current.x][current.y];
			console.log("Target found!");
			return;
		}

		// traverse throught the 4 adjacent tiles
		for(var i = -1; i < 2; i++){
			for(var j = -1; j < 2; j++){
	
				// skip the current and corner tiles
				if(i == 0 && j == 0)
					continue;

				if(!allowDiagonals){
					if(i != 0 && j != 0){
						continue;
					}	
				}
				
				// make sure we're not out of bounds
				if(outOfBounds(current.x + i, current.y + j))
					continue;

				// save our tile to be processed
				var n = board[current.x + i][current.y + j];

				// make sure were not already on closed list
				if(contains(closedList, n) || n.isWall){
					continue;
				}
				
				if(!contains(openList, n) || current.g + 1 < n.g){
					// set parent and update
					board[n.x][n.y].parent = current;
					updateHueristics(n, current.g + 1);

					if(!n.isOnOpenList){
						// move it to the open list
						openList.push(n);
						board[n.x][n.y].isOnOpenList = true;
						board[n.x][n.y].isOnClosedList = false;
					}
				}
			}
		}
	}else{
		tracePath();
	}
}

// get the tentative g value
function tentativeG(current, n){
	return current.g + distance(current, n);
}

// traces the path
function tracePath(){
	if(tracer == null || tracer.parent == null){
		stop();
		return;
	}

	board[tracer.x][tracer.y].isPath = true;
	tracer = tracer.parent;
}

// check if a tile index is on the board
function outOfBounds(i, j){
	 return (i >= DIM || j >= DIM) || (i < 0 || j < 0);
}

// tells if the needle is found in the haystack by index values
function contains(haystack, needle){
	for(var i = 0; i < haystack.length; i++){
		if(needle.x == haystack[i].x && needle.y == haystack[i].y){
			return true;
		}
	}
	return false;
}
