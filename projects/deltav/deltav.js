
var green = '#30a36b';
var red = '#96162e';

var canvas;
var context;
var bodies = ['earth', 'moon', 'mars', 'jupiter', 'saturn'];
var map;

$(document).ready(function(){

	canvas = document.getElementById("discanvas");
	canvas.width = canvas.height = 700;
	context = canvas.getContext("2d");
	map = new dv_map(canvas.width, canvas.height);

	render('falcon_heavy');
});

function render(rocket_name, payload){

	var rocket = rockets[rocket_name];

	payload = (payload) ? Number(payload.value) : rocket.leo_payload;

	var div = $('#rocket-config');
	div.empty();
	var html = '';

	var delta_v = 0;
	var seq = rocket.config;
	
	html += '<h3 class="inline" id="rocket-name">' + rocket.name + '</h3>';
	html += '<p class="inline">Payload:</p><h5 id="payload" class="inline">' + payload + ' kg<h5>';
	html += '<input id="payload-input" class="inline" type="range"  min="0" max="' + rocket.payload_max + '" value="' + payload + '" onchange="render(\'' + rocket_name + '\', this)"/><hr>'
	html += '<table class="table table-condensed">';
	html += '<tr class="text-center"><th></th>';
	html += '<th><h5 class="inline">Impulse (s)</h5><img class="inline" src="/projects/deltav/impulse.png" alt="Engine" height="15"></th>';
	html += '<th><h5 class="inline">Wet (kg)</h5><img class="inline" src="/projects/deltav/full_cup.jpg" alt="Wet Mass" height="15"></th> ';
	html += '<th><h5 class="inline">Dry (kg)</h5><img class="inline" src="/projects/deltav/empty_cup.png" alt="Dry Mass" height="15"></th></tr>';

	console.log(payload);

	for(var i = 0; i < seq.length; i++){
		if(typeof seq[i] == 'string'){
			html += '<tr><td><h4>';
			html += seq[i];
			html += '</h4></td><td></td><td></td><td></td></tr>';
		}else{
			var stage_dv = dv(seq[i], payload);
			delta_v += stage_dv;

			html += '<tr class="text-center"><td><img class="arrow" src="/arrow.jpg" alt="Arrow">';
			html += '<h4>' + stage_dv.toFixed(2) + '&#916;V</h4></td>'
			html += '<td>' + seq[i][0] + '</td>';
			html += '<td>' + (seq[i][1] + payload) + '</td>';
			html += '<td>' + (seq[i][2] + payload) + '</td>';
			html += '</tr>';
		}
	}
	html += '</table>';

	div.html(html);
	draw(delta_v.toFixed(2));
}

function dv(data, payload){
	return 9.80665 * data[0] * Math.log((data[1] + payload)/(data[2] + payload));
}

function update_deltav(val){
	$('#deltav').html(val + " m/s");
}

function draw(delta_v){

	update_deltav(delta_v);

	context.clearRect(0, 0, canvas.width, canvas.height);
	context.fillStyle = "black";
	context.fillRect(0, 0, canvas.width, canvas.height);

	// draw the planets images
	for(var i = 0; i < bodies.length; i++){
		draw_image(bodies[i], map[bodies[i]]);
	}

	// draw the lines to orbits
	context.lineWidth = 2;
	draw_lines(delta_v, -10, 'earth', 'mars');
	draw_lines(delta_v, 0, 'earth', 'jupiter');
	draw_lines(delta_v, 10, 'earth', 'saturn');
	draw_lines(delta_v, 20, 'earth', 'moon');
	draw_earth_orbits(delta_v, map.earth);
}

function draw_lines(delta_v, offset, body1, body2){
	context.strokeStyle = (map[body2].delta_v < delta_v) ? green : red;
	context.beginPath();
	context.moveTo(map[body1].x + offset, map[body1].y + offset);
	context.lineTo(map.hub.x + offset, map.hub.y);
	context.lineTo(map[body2].x, map[body2].y);
	context.stroke();
}

function draw_earth_orbits(delta_v, body){

	// LEO Orbit
	context.strokeStyle = (dv_leo < delta_v) ? green : red;
	context.beginPath();
	context.arc(body.x, body.y, body.dim / 2 + 21, 0, 2 * Math.PI);
	context.stroke();

	// GTO-1800 Orbit
	context.strokeStyle = (dv_gto < delta_v) ? green : red;
	context.beginPath();
	context.arc(body.x, body.y, body.dim / 2 + 30, 0, 2 * Math.PI);
	context.stroke();
}

function draw_image(image, cords){
	var img = new Image();
	img.src = '/' + image + '.jpg';
	img.onload = function(){
		context.drawImage(img, cords.x - cords.dim/2, cords.y - cords.dim/2);
	}
}
