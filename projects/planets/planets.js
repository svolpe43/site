
var SCALE = 200 / AU

var canvas;
var context;
var cur;

var dim = 700;
var run = false;

$(document).ready(function(){

	canvas = document.getElementById("discanvas");
	canvas.width = canvas.height = dim;
	context = canvas.getContext("2d");
	draw(initial);

});

function start(){
	if(run)
		return;

	run = true;
	get_next(initial);
}

function resume(){
	run = true;
	get_next(cur);
}

function stop(){
	run = false;
}

function reset(){
	run = false;
	setTimeout(function(){
		draw(initial);
	}, 150);
}

function get_next(current){

	cur = current;

	draw(current);

	$.ajax({
		url: 'planets/step',
		data: 'last=' + encodeURIComponent(JSON.stringify(current)),
		success: handle,
		contentType: 'application/json',
	});
}

function handle(text){

	var data = JSON.parse(text);

	if(run){
		setTimeout(function(){
			get_next(data);
		}, 100);
	}
}

function draw(planets){
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.fillStyle = 'black';
	context.fillRect(0, 0, canvas.width, canvas.height);

	console.log(planets);
	for(var i = 0; i < planets.length; i++){
		draw_planet(planets[i].px, planets[i].py, color_lookup(planets[i].name), planets[i].name);
	}
}

function draw_planet(x, y, color, name){
	var xy = quad_to_canvas(x * SCALE, y * SCALE);

	context.font = '10px Arial';
	context.fillStyle = '#fff';
	context.fillText(name, xy[0] - 10, xy[1] - 10);

	context.fillStyle = color;
	context.beginPath();
	context.arc(xy[0], xy[1], 7, 0, 2 * Math.PI);
	context.stroke();
	context.fill();
}

function quad_to_canvas(x, y){
	return [dim/2 + x, dim/2 - y];
}

function color_lookup(planet){
	switch(planet){
		case 'Earth': return '#569ee2';
		case 'Venus': return '#e2b656';
		case 'Sun': return '#db6d1a';
		case 'Mercury': return '#683b10';
		case 'Mars': return '#c11111';
	}
}
