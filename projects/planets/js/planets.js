
/*
	TODO
	- New features
		- orbit visualizer, add orbit parameters to controls and show line
		- mars proximity finder, run through the time until you get a mars closest point
		- Add a planet real scale toggle
		- camera go to x, y z axis
*/

// 149.6 million km, in meters.
const AU = (149.6e6 * 1000)

var ui, planets3js;

var last_update = 0;

$(document).ready(function(){
	load_data();
});

function start(){

	$('#threejs').show();
	$('#progress-wrapper').hide();

	for(var i = 0; i < orbit_data.vectors.length; i++){
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

	planets3js = new Planets3js();

	ui = new UI(function(){
		planets3js.update_meshes();
		planets3js.render();
	});
}

function animate() {

	// todo: animate as fast as possible but slow the update position
	var threshold = (ui.Speed === 0) ? 2147483647 : 1000 / ui.Speed;

	requestAnimationFrame(animate);

	controls.update();

	var now = new Date();

	if(ui.run && (now - last_update) > threshold){
		last_update = new Date();

		ui.increment_index(true);

		planets3js.update_meshes();
	}
	planets3js.render();
}
