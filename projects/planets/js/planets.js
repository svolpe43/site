
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

	for(var i = 0; i < orbit_data.vectors.length; i++){
		console.log(orbit_data.vectors[i].name, orbit_data.vectors[i].orbit.length, 'days');
	}

	init();
	animate();
});

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
