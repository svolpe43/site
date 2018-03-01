
/*
	TODO
	- Binary search line 193
	- New features
		- orbit visualizer, add orbit parameters to controls and show line
		- mars proximity finder, run through the time until you get a mars closest point
		- Add a planet real scale toggle
		- camera go to x, y z axis
	- Fix planets orientation
	- Look into planet axis angle data and rotation data
*/

// 149.6 million km, in meters.
const AU = (149.6e6 * 1000)

// three.js
var camera, scene, renderer, controls, stats, texture_loader;	
var meshes = [];

// Congif UI
var gui, state, day_controller, date_controller;

var months = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

var planet_mesh_config = [
	{
		name: 'Sun',
		color: null,
		radius: 75,
		texture: THREE.MeshBasicMaterial,
		img: 'sunmap.jpg'
	},{
		name: 'Mercury',
		color: null,
		radius: 35,
		texture: THREE.MeshPhongMaterial,
		img: 'mercurymap.jpg'
	},{
		name: 'Venus',
		color: null,
		radius: 35,
		texture: THREE.MeshPhongMaterial,
		img: 'venusmap.jpg'
	},{
		name: 'Earth',
		color: null,
		radius: 35,
		texture: THREE.MeshPhongMaterial,
		img: 'earthmap1k.jpg'
	},{
		name: 'Mars',
		color: null,
		radius: 35,
		texture: THREE.MeshPhongMaterial,
		img: 'marsmap1k.jpg'
	}
];

var State = function() {
	this.Date = '1-1-2000';
	this.Speed = 1;
	this.index = 0;
	this.Year = 2000;
	this.Month = 1;
	this.Day = 1;
	this.Start = start;
	this.Stop = stop;
	this.run = true;
};

function start(){
	console.log('Start');
	state.run = true;
}

function stop(){
	console.log('Stop')
	state.run = false;
}

$(document).ready(function(){

	for(var i = 0; i < orbit_data.vectors.length; i++){
		console.log(orbit_data.vectors[i].name, orbit_data.vectors[i].orbit.length);
	}

	init();
	animate();
});

function init() {

	// setup camera
	camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 100000);
	camera.position.z = 400;
	camera.position.y = -3000;
	camera.rotation.x = 80 * Math.PI / 180;

	// configure texture loader
	texture_loader = new THREE.TextureLoader();

	scene = new THREE.Scene();

	// add lights to scene
	scene.add(new THREE.PointLight(0xffffff, 2, 1000000));
	scene.add(new THREE.AmbientLight(0x666666));

	// add planets to scene
	add_planets_rec(0);

	// add star field
	texture_loader.load('/projects/planets/img/galaxy_starfield.png', function( map ) {
		var material	= new THREE.MeshBasicMaterial({
			map	: map,
			side : THREE.BackSide
		});
		var geometry	= new THREE.SphereGeometry(10000, 32, 32);
		var mesh	= new THREE.Mesh(geometry, material);
		mesh.rotation.x = Math.PI / 2;
		scene.add(mesh);
	});

	// add renderer
	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

	// add live statistics
	stats = new Stats();
	document.body.appendChild(stats.dom);

	// resize when window resizes
	window.addEventListener( 'resize', onWindowResize, false );

	state = new State();
	gui = new dat.GUI();
	date_controller = gui.add(state, 'Date').onChange(parse_date);
	gui.add(state, 'Start');
	gui.add(state, 'Stop');
	gui.add(state, 'Speed', 0, 365, 1);
	gui.add(state, 'Year', 2000, 2020, 1).onChange(date_change);
	gui.add(state, 'Month', 1, 12, 1).onChange(update_days_on_month_change);
	day_controller = gui.add(state, 'Day', 1, 31, 1).onChange(date_change);

	// add mouse controls
	controls = new THREE.TrackballControls(camera, renderer.domElement);
	controls.rotateSpeed = 5.0;
	controls.zoomSpeed = 5.0;
	controls.panSpeed = 1.0;
	controls.noZoom = false;
	controls.noPan = false;
	controls.staticMoving = true;
	controls.dynamicDampingFactor = 0.3;
	controls.keys = [ 65, 83, 68 ];
	controls.addEventListener( 'change', render );

	render();
}

function add_planets_rec(index){

	if(index === planet_mesh_config.length){
		return;
	}

	var planet = planet_mesh_config[index];

	texture_loader.load('/projects/planets/img/' + planet.img, function(map) {
		map.minFilter = THREE.LinearFilter; // clears error from images not 2:1
		var material	= new planet.texture({ map	: map});
		var geometry = new THREE.SphereGeometry(planet.radius, 32, 32);
		var mesh = new THREE.Mesh( geometry, material );

		scene.add(mesh);
		meshes[planet_mesh_config[index].name] = mesh;

		add_planets_rec(index + 1);
	});
}

function update_days_on_month_change(index){
	gui.remove(day_controller);
	if(state.Day > months[index - 1]){
		state.Day = months[index - 1];
	}
	day_controller = gui.add(state, 'Day', 1, months[index - 1], 1);
	date_change(index);
}

function parse_date(date_str){

	console.log(date_str);

	
	var parts = date_str.split('-').map(Number);
	console.log(parts);

	var index = date_to_index(parts);
	console.log(index);
	if(index){
		state.index = index;
		state.Year = Number(parts[2]);
		state.Month = Number(parts[1]);
		state.day = Number(parts[0]);
		date_change();
	}
}

function date_change(){
	state.index = date_to_index([state.Day, state.Month, state.Year]);
	console.log(state);
	date_controller.setValue([state.Day, state.Month, state.Year].join('-'));
	update_ui();
}

function animate() {
	requestAnimationFrame(animate);
	increment_state_index(true);
	update_ui();
}

function increment_state_index(is_up){
	if(state.run){
		if(is_up){
			state.index = (state.index < orbit_data.dates.length - 1) ? state.index + 1 : 0;
		}
	}
}

function update_ui(){
	update_position(state.index);
	renderer.render(scene, camera);
	controls.update();
}

function update_position(index){

	// dont update position if we haven't loaded planet meshes yet
	if(Object.keys(meshes).length === planet_mesh_config.length){
		// loop over planets updating the position
		for(var i = 0; i < orbit_data.vectors.length; i++){
			planet = orbit_data.vectors[i];
			meshes[planet.name].position.x = (planet.orbit[index].p[0]) * 1000;
			meshes[planet.name].position.y = (planet.orbit[index].p[1]) * 1000;
			meshes[planet.name].position.z = (planet.orbit[index].p[2]) * 1000;
		}
	}
}

function get_next(current, success){
	$.ajax({
		url: 'planets/step',
		data: 'last=' + encodeURIComponent(JSON.stringify(current)),
		success: success,
		contentType: 'application/json',
	});
}

function render(){
	renderer.render( scene, camera );
	stats.update();
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
	controls.handleResize();
	render();
}

// returns the index of the date given
// performs binary search on orbit_data.dates array
// date - [day, month, year]
function date_to_index(date){

	var t0 = performance.now();

	var arr = orbit_data.dates;
	var date = new Date(date[2], date[1], date[0]);

	var index = Math.floor(arr.length / 2);
	var start = 0;
	var end = arr.length;

	while(true){

		if(same_day(new Date(arr[index]), date)){
			return index;
		}else if(start > end){
			return null;
		}

		if(Date.parse(arr[index]) > date){
			end = index - 1;
		}else{
			start = index + 1;
		}

		index = Math.floor((start + end) / 2);
	}
}

function same_day(d1, d2){
	return d1.getUTCFullYear() === d2.getUTCFullYear() &&
    d1.getUTCMonth() === d2.getUTCMonth() &&
    d1.getUTCDate() === d2.getUTCDate();
}