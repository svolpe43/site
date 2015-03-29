
/* The Game of Life */

var boardDimWithoutLines = 600;
var lineWidth = 1;
var running = false;
var lastxcell = -1;
var lastycell = -1;

var canvas;
var context;
var board;
var interval;
var delta;
var cellDim;
var DIM;
var lineOffset;
var boardDimWithLines;
var density;

var userIsPickingStart = false;
var userIsPickingStop = false;

// astar stuff
var astar;
var start;
var target;
var openList = [];
var closedList = [];
var current;

$(document).ready(function(){
	canvas = document.getElementById("discanvas");

	canvas.onmousedown = mouseDown;
	canvas.onmouseup = mouseUp;

	context = canvas.getContext("2d");
	context.lineWidth = lineWidth;
	initBoard();
});

Array.matrix = function(numrows, numcols){
   var arr = [];
   for (var i = 0; i < numrows; ++i){
      var columns = [];
      for (var j = 0; j < numcols; ++j){
         columns[j] = new Tile(i, j);
      }
      arr[i] = columns;
    }
    return arr;
}

/* GUI input */

function startnow(){
	if(!running){
		console.log("Starting...");
		interval = setInterval(step, delta);
		running = true;
	}
}

function stop(){
	if(running){
		console.log("Stopping...");
		clearInterval(interval);
		running = false;
	}
}

function setRandom(){
	stop();
	randomize();
	initAstar();
	draw();
}

function updateNow(){
	stop();
	updateSettingsFromUI();
	randomize();
	draw();
}

function reset(){
	stop();
	clear();
	draw();
}

function showDeltaNow(val){
	delta = - Number(val);
	console.log(delta);
	stop();
	startnow();
	$('#deltaval').text(-val + " ms");
}

function showDensityNow(val){
	density = Number(val);
	$('#densityval').text(val + "%");
}

/* interal use */

function initBoard(){
	updateSettingsFromUI();
	board = Array.matrix(DIM, DIM);
	randomize();
	initAstar();
	draw();
}

function updateSettingsFromUI(){
	delta = - Number($("#delta").val());
	cellDim = Number($("#dim").val());
	density = Number($("#density").val());
	updateSettings();
}

function updateSettingsFromPattern(dim){
	cellDim = dim;
	updateSettings();
}

function updateSettings(){
	lineWidth = (cellDim < 15) ? 0 : 1;

	DIM = boardDimWithoutLines / cellDim;
	lineOffset = (lineWidth * (DIM - 1));
	boardDimWithLines = boardDimWithoutLines + lineOffset;

	board = Array.matrix(DIM, DIM);

	canvas.width = canvas.height = boardDimWithLines;
	context.clearRect(0, 0, canvas.width, canvas.height);
}

// fill the board with random data
function randomize(){
	clear();
	for(var i = 0; i < DIM; i++){
		for(var j = 0; j < DIM; j++){
			if(Math.random() < density/100)
				board[i][j].isWall = true;
		}
	}

	// reset the astar endpoints
	setStartPosition(2, 2);
	setStopPosition(DIM - 2, DIM - 2);
}

// sets a flag for the mouse down event
function setUserPickingStart(){
	userIsPickingStart = true;
}

// sets a flag for the mouse down event
function setUserPickingStop(){
	userIsPickingStop = true;
}

// sets the start position of astar
function setStartPosition(x, y){
	// only reset existing target if we had one
	if(start != null){
		board[start.x][start.y].isStart = false;
		board[start.x][start.y].isOnOpenList = false;
	}

	start = new Tile(x, y);
	board[x][y].isStart = true;
	board[x][y].isWall = false;
}

// sets stop position of astar
function setStopPosition(x, y){
	// only reset existing target if we had one
	if(target != null)
		// this is needed when reducing board size
		if(!outOfBounds(target.x, target.y))
			board[target.x][target.y].isTarget = false;

	target = new Tile(x, y);
	board[x][y].isTarget = true;
	board[x][y].isWall = false;
}

function clear(){
	board = Array.matrix(DIM, DIM);
}

function mouseDown(event){
	console.log("mouse down");

	lastxcell = Math.floor(getCord(event.y, false)/(cellDim + lineWidth));
	lastycell = Math.floor(getCord(event.x, true)/(cellDim + lineWidth));

	console.log(lastxcell + ", " + lastycell);

	if(userIsPickingStart){
		setStartPosition(lastxcell, lastycell);
		userIsPickingStart = false;
		initAstar();
	}else if(userIsPickingStop){
		setStopPosition(lastxcell, lastycell);
		userIsPickingStop = false;
	}else{
		board[lastxcell][lastycell].isWall = (board[lastxcell][lastycell].isWall) ? false : true;
	}

	draw();
	
	canvas.onmousemove = mouseMove;
}

function mouseMove(event){
	console.log("mouse move");

	x = Math.floor(getCord(event.y, false)/(cellDim + lineWidth));
	y = Math.floor(getCord(event.x, true)/(cellDim + lineWidth));

	// turn on mouse move when off canvas
	if(x >= DIM || y >= DIM || x < 0 || y < 0){
		canvas.onmousemove = null;
		return;
	}

	if(x != lastxcell || y != lastycell){
		board[x][y].isWall = (board[x][y].isWall) ? false : true;
		lastxcell = x;
		lastycell = y;
		draw();
	}
}

function mouseUp(event){
	console.log("mouse up");
	canvas.onmousemove = null;
}

function getCord(eventN, isX){
	return canvasN = (isX) ? 
		eventN - canvas.offsetLeft + $(document).scrollLeft() :
		eventN - canvas.offsetTop + $(document).scrollTop();
}

function step(){
	updateBoard();
	draw();
}

function draw(){
	drawLines();
	drawCells();
}

function drawLines(){
	context.fillStyle="#000000";
	var offset = cellDim + lineWidth;
	var x = 0;
	var y = cellDim + lineWidth/2;

	context.beginPath();

	// horizontal lines - y incrementing x is the same
	for(var i = 0; i < DIM - 1; i++){
		context.moveTo(x, y);
		context.lineTo(x + boardDimWithLines, y);
		context.stroke();
		y += offset;
	}

	x = cellDim + lineWidth/2;;
	y = 0;

	// vertical lines - x incrementing y is the same
	for(var i = 0; i < DIM - 1; i++){
		context.moveTo(x, y);
		context.lineTo(x, y + boardDimWithLines);
		context.stroke();
		x += offset;
	}
}

function drawCells(){
	context.fillStyle="#9966ff";
	var offset = cellDim + lineWidth;
	var x = 0;
	var y = 0;
	for(var i = 0; i < DIM; i++){
		for(var j = 0; j < DIM; j++){
			if(board[i][j].isWall){
				context.fillStyle="#520052";
				context.fillRect(x, y, cellDim, cellDim);
			}else if(board[i][j].isTarget){
				context.fillStyle="#ffe77b";
				context.fillRect(x, y, cellDim, cellDim);
			}else if(board[i][j].isStart){
				context.fillStyle="#ffe77b";
				context.fillRect(x, y, cellDim, cellDim);
			}else if(board[i][j].isPath){
				context.fillStyle="#ff3f68";
				context.fillRect(x, y, cellDim, cellDim);
			}else{
				if(board[i][j].isOnOpenList){
					context.fillStyle="#66c2c2";
					context.fillRect(x, y, cellDim, cellDim);
				}else if(board[i][j].isOnClosedList){
					context.fillStyle="#006699";
					context.fillRect(x, y, cellDim, cellDim);
				}else{
					context.clearRect(x, y, cellDim, cellDim);
				}
			}
			x += offset;
		}
		y += offset;
		x = 0;
	}
}

function updateBoard(){
	iterateAstar();
}

