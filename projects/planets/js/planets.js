
/*
	Bugs
		- Orbit planet selector slow when choosing
		- Orbit slow to update during orbital element changes
		- Planet orbits not accurate to the planet orbit animations
		- Time is off by a factor of 10
*/

var ui, planets3js, astro;

// for speed control
var last_update = 0;

// for closest distance calculations
var last_mars_earth_distance = 2147483647;
var going_up = false;

$(document).ready(function(){
	load_data();
});

function start(){

	$('#threejs').show();
	$('#progress-wrapper').hide();

	for(var i = 0; i < orbit_data.vectors.length; i++){

		var years = {
			'Mercury': 88,
			'Venus': 225,
			'Earth': 366,
			'Mars': 688
		};

		orbit_data.vectors[i].orbit_duration = years[orbit_data.vectors[i].name];
		console.log(orbit_data.vectors[i].name, orbit_data.vectors[i].orbit.length, 'days');
	}

	init();
	animate();
}

function update_progress(decimal){
	var percent = decimal * 100;
    $('#progress').width(percent + '%');
    $('#progress-message').text('Loading 60 decades of inner planet position data. ' + Math.floor(percent) + '%');
}

function load_data(){
    $.ajax ({
        url : 'planets/js/inner_solar_system_data.js',
        xhr: function() {
            var xhr = new window.XMLHttpRequest();
            xhr.addEventListener("progress", function(evt){
				if (evt.lengthComputable) {
					update_progress(evt.loaded / evt.total);
				}
            }, false);

           return xhr;
        },
        success : start
    });
}

function init(){

	astro = new Astro();
	planets3js = new Planets3js();

	ui = new UI(function(){
		planets3js.update_meshes();
		planets3js.render();
	});

	planets3js.calculate_orbit();
}

function animate() {

	// animate as fast as possible but slow the update position
	var threshold = (ui.speed === 0) ? 2147483647 : 1000 / ui.speed;

	requestAnimationFrame(animate);

	var now = Date.now();
	if(ui.run && (now - last_update) > threshold){
		last_update = Date.now();
		ui.increment_index(true);
		planets3js.update_meshes();
		planets3js.increment_orbit();
		stop_on_earth_mars_closest();
	}else{
		if(controls){
			controls.update();
		}
	}

	planets3js.render();
}

function stop_on_earth_mars_closest(){
	var mars_earth_distance = planets3js.mars_earth_distance();

	if(!going_up && last_mars_earth_distance < mars_earth_distance){

		if(ui.stop_on_earth_mars_flyby){
			ui.run = false;
		}

		going_up = true;
	}else if(going_up && last_mars_earth_distance > mars_earth_distance){
		going_up = false;
	}

	last_mars_earth_distance = mars_earth_distance;
}
