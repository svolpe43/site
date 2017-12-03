
/* The Game of Life */

var boardDimWithoutLines = 600;
var lineWidth = 1;
var running = false;
var lastxcell = -1;
var lastycell = -1;

var canvas;
var context;
var interval;
var lineOffset;
var grid_height;
var grid_width;
var line_height_offset;
var line_width_offset;
var board;
var cursor;

var note_div;
var page;
var notes;

$(document).ready(function(){
	//canvas = document.getElementById("discanvas");

	//canvas.onmousedown = mouseDown;
	//canvas.onmouseup = mouseUp;

	//context = canvas.getContext("2d");
	//context.lineWidth = lineWidth;
	note_div = $("#note");

	initBoard();
});

Array.matrix = function(numrows, numcols, initial){
   var arr = [];
   for (var i = 0; i < numrows; ++i){
      var columns = [];
      for (var j = 0; j < numcols; ++j){
         columns[j] = initial;
      }
      arr[i] = columns;
    }
    return arr;
}

function start(){
	if(!running){
		console.log("Starting pad watcher...");
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

/*
 * Initialization
 * - obtaining settings from UI inputs
 * - canvas and global resizing
 */

function initBoard(){
	//updateSettings();
	//cursor = new Cursor();
	//draw();
	//var db = new DB();
	//db.get();

	// start text area experiments
	page = getNote();
	addLines(page);
}

function addLines(page){
	if(typeof page === 'undefined')
		return;

	for(var i = 0; i < page.length; i++){
		var line = "<textarea rows='1' class='indent-" + page[i].depth + "'>" + page[i].stuff + "</textarea>";
		note_div.append(line);
	}
	note_div.children().each(function(index){
		$(this).addClass("fucky");
	});
}

function Liner(text, depth){
	this.stuff = text;
	this.depth = depth;
}

function setUpBoard(){
	board = [];
}

function handleNode(node, index){
	for(var i = 0; i < node.children.length; i++){
		handleNode(node.children[i], index + 1);
	}
}

function updateSettings(){
	cell_height = 16;
	cell_width = 10;

	canvas.width = $("#container").width();
	canvas.height = $("#container").height();

	grid_height = canvas.height / cell_height;
	grid_width = canvas.width / cell_width;

	context.clearRect(0, 0, canvas.width, canvas.height);
}

/*
 * User Actions
 * - mousedown - highlighting start location
 * - mouseup - should place index position at event location
 * - mousemove - should handle highlighting
 */

function mouseDown(event){
	console.log("mouse down");
}

function mouseUp(event){
	console.log("mouse up");

	var cords = getCords(event);

	cursor.x = Math.floor(cords.x/cell_width);
	cursor.y = Math.floor(cords.y/cell_height);

	draw();
}

function mouseMove(event){
	console.log("mouse move");

	// turn on mouse move when off canvas
	if(x >= DIM || y >= DIM || x < 0 || y < 0){
		canvas.onmousemove = null;
		return;
	}
}

/*
 * UI calculations
 * - drawing components
 * - obtaining index position from click events
 */

 function onCanvas(x, y){
 	return (x >= grid_width || y >= grid_height || x < 0 || y < 0);
 }

function getCords(event){
	return {
		x: event.x - canvas.offsetLeft + $(document).scrollLeft(),
		y: event.y - canvas.offsetTop + $(document).scrollTop()
	};
}

function step(){
	updateBoard();
	drawCells();
}

function draw(){
	//drawCells();
	//drawLines();
	drawCursor();
}

function drawLines(){
	context.strokeStyle = "#000";

	var x = 0;
	var y = 0;
	// horizontal lines - y incrementing x is the same
	for(var i = 0; i < grid_height; i++){
		context.moveTo(x, y);
		context.lineTo(x + canvas.width, y);
		context.stroke();
		y += cell_height;
	}

	x = y = 0;

	// vertical lines - x incrementing y is the same
	for(var i = 0; i < grid_width; i++){
		context.moveTo(x, y);
		context.lineTo(x, y + canvas.height);
		context.stroke();
		x += cell_width;
	}
}

function drawCursor(){
	context.strokeStyle = "#ff0000";
	context.lineWidth = 2;
	var x = cursor.x * cell_width;
	var y = cursor.y * cell_height;

	context.beginPath();
	context.moveTo(x, y);
	context.lineTo(x, y + cell_height);
	context.stroke();
}

function drawCells(){
	context.fillStyle = "#fff";
	var x = 0;
	var y = 0;


	for(var i = 0; i < grid_height; i++){
		for(var j = 0; j < grid_width; j++){
			context.fillRect(x, y, cell_width, cell_height);
			x += cell_width;
		}
		y += cell_height;
		x = 0;
	}
}

function Cursor(){
	this.x = 2;
	this.y = 2;
}

function dummies(){
	var note = [];
	
	note[0] = new Liner("This is line one", 0);
	note[1] = new Liner("This is line two and where should I put the depths", 0);
	note[2] = new Liner("Line 3 and yea I think the db should have line objects with certain prototypes.", 1);
	note[3] = new Liner("The prototypes could be... indent, unindent", 2);
	note[4] = new Liner("Where do I put the methods that add new ones and delete ones", 1);
	note[5] = new Liner("And where are those controls, are they buttons?", 2);
	note[6] = new Liner("The methods should just in all context.", 3);
	note[7] = new Liner("The buttons for them could be on the side or how the mobile notepad app has it with buttons on the side.", 3);

	return note;
}

/*

	OLD AJAX FOR PAGE DOWNLOAD AND UPLOAD

*/

function download(){
	console.log("Downloading...");
	$.ajax({
		url: php_file,
		success: function(result){
			page = JSON.parse(result);
			populate();
		},
		error: function(xhr, options, error){
			console.log(xhr);
			console.log(error);
		}
	});
}

function save(){
	$.ajax({
		url: php_file,
		method: "POST",
		data: {json: JSON.stringify(page)},
		success: function(result){
			console.log(result);
		},
		error: function(xhr, options, error){
			console.log(xhr);
			console.log(error);
		}
	});
}