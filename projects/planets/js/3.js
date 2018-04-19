
var camera, scene, renderer, controls, stats, texture_loader;
var meshes = {};
var solar_system_plane_mesh, orbit_mesh;
var planet_orbit_plot_dots = [];

var orbit_vertices = [];
var orbit_plot_dots = [];

var planet_mesh_config = {
	'Sun': {
		name: 'Sun',
		color: null,
		actual_radius: 75,
		radius: 75,
		texture: THREE.MeshBasicMaterial,
		img: 'sunmap.jpg'
	},
	'Mercury': {
		name: 'Mercury',
		color: null,
		actual_radius: 20,
		radius: 35,
		texture: THREE.MeshPhongMaterial,
		img: 'mercurymap.jpg'
	},
	'Venus': {
		name: 'Venus',
		color: null,
		actual_radius: 40,
		radius: 35,
		texture: THREE.MeshPhongMaterial,
		img: 'venusmap.jpg'
	},
	'Earth': {
		name: 'Earth',
		color: null,
		actual_radius: 40,
		radius: 35,
		texture: THREE.MeshPhongMaterial,
		img: 'earthmap1k.jpg'
	},
	'Mars': {
		name: 'Mars',
		color: null,
		actual_radius: 25,
		radius: 35,
		texture: THREE.MeshPhongMaterial,
		img: 'marsmap1k.jpg'
	}
};

function Planets3js(){
	init_scene();
	this.render = render;
}


Planets3js.prototype.update_meshes = function(){
	if(ui){
		update_mesh_positions(ui.index);
	}
}

//2) = √(x2 − x1)2 + (y2 − y1)2 + (z2 − z1)2
Planets3js.prototype.mars_earth_distance = function(){
	if(meshes_are_loaded()){

		var mars = meshes['Mars'].position;
		var earth = meshes['Earth'].position;

		var dx = mars.x - earth.x;
		var dy = mars.y - earth.y;
		var dz = mars.z - earth.z;
		return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2) + Math.pow(dz, 2));
	}
	return 2147483647;
}

Planets3js.prototype.toggle_solar_system_plane = function(show){
	if(show){
		var geometry = new THREE.CircleGeometry( 2000, 32 );
		var material = new THREE.MeshLambertMaterial({
			color: 0x42f46b,
			transparent: true,
			opacity: 0.25,
			side: THREE.DoubleSide
		});
		solar_system_plane_mesh = new THREE.Mesh( geometry, material );
		scene.add(solar_system_plane_mesh);
	}else{
		scene.remove(solar_system_plane_mesh);
	}
}

Planets3js.prototype.draw_orbit = function(){

	remove_meshes(orbit_plot_dots);

	if(ui.orbit.show){
		var geometry = new THREE.SphereGeometry(4, 32);
		var material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
		for(var i = 0; i < orbit_vertices.length; i++){
			var dot = new THREE.Mesh(geometry, material);
			dot.position.set(
				orbit_vertices[i].position[0],
				orbit_vertices[i].position[1],
				orbit_vertices[i].position[2]);
			scene.add(dot);
			orbit_plot_dots.push(dot);
		}
	}
}

Planets3js.prototype.calculate_orbit = function(){
	orbit_vertices = astro.plot_orbit(
		ui.orbit.a,
		ui.orbit.e,
		ui.orbit.i,
		ui.orbit.ap,
		ui.orbit.lan);
}

Planets3js.prototype.increment_orbit = function(){

	if(ui.orbit.run){

		ui.orbit.index = (ui.orbit.index >= orbit_vertices.length - 1) ? 0 : ui.orbit.index + 1;

		var geometry = new THREE.SphereGeometry(4, 32);
		var material = new THREE.MeshBasicMaterial( { color: 0xffffff } );

		var dot = new THREE.Mesh(geometry, material);

		dot.position.set(
			orbit_vertices[ui.orbit.index].position[0],
			orbit_vertices[ui.orbit.index].position[1],
			orbit_vertices[ui.orbit.index].position[2]);

		scene.add(dot);
		orbit_plot_dots.push(dot);

		ui.update_orbit_state_vectors(orbit_vertices[ui.orbit.index]);
	}
}

Planets3js.prototype.clear_orbit = function(){
	remove_meshes(orbit_plot_dots);
}

Planets3js.prototype.toggle_plot_planet_orbits = function(show){

	remove_meshes(planet_orbit_plot_dots);

	if(show){
		var index = ui.index;
		var geometry = new THREE.SphereGeometry(4, 32);
		var material = new THREE.MeshBasicMaterial( { color: 0xffffff } );

		// loop over planets
		for(var i = 0; i < orbit_data.vectors.length; i++){

			var planet = orbit_data.vectors[i];

			if(planet.name === 'Sun'){
				continue;
			}

			for(var j = 0; j < planet.orbit_duration; j++){
				var dot = new THREE.Mesh(geometry, material);
				dot.position.set(
					planet.orbit[index + j].p[0] * 1000,
					planet.orbit[index + j].p[1] * 1000,
					planet.orbit[index + j].p[2] * 1000
				)
				scene.add(dot);
				planet_orbit_plot_dots.push(dot);
			}
		}
	}
}

Planets3js.prototype.toggle_actual_planet_sizes = function(on){
	for(var i = 0; i < orbit_data.vectors.length; i++){

		var planet = orbit_data.vectors[i];
		var radius = planet_mesh_config[planet.name].radius;
		var actual_radius = planet_mesh_config[planet.name].actual_radius

		var multiplier = (on) ? actual_radius / radius : 1;

		meshes[planet.name].scale.x = multiplier;
		meshes[planet.name].scale.y = multiplier;
		meshes[planet.name].scale.z = multiplier;
	}
}

Planets3js.prototype.set_camera_focus = function(body){
	if(controls){
		controls.target = meshes[body].position.clone();
		controls.update();
	}
}

function remove_meshes(meshes){
	for(var i = 0; i < meshes.length; i++){
		scene.remove(meshes[i]);
	}
}

function render(){
	renderer.render( scene, camera );
	stats.update();
}

function init_scene() {

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

	// add planets to scene and set control focus to Sun
	add_planets(setup_controls);

	// add star field
	texture_loader.load('/projects/planets/img/galaxy_starfield.png', function( map ) {
		var material	= new THREE.MeshBasicMaterial({
			map	: map,
			side : THREE.BackSide
		});
		var geometry	= new THREE.SphereGeometry(10000, 32, 32);
		var mesh	= new THREE.Mesh(geometry, material);
		mesh.rotation.z = Math.PI / 2;
		scene.add(mesh);
	});

	// add renderer
	var threejs_element = $('#threejs');
	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setSize( window.innerWidth, window.innerHeight );
	threejs_element.append(renderer.domElement);

	// add live statistics
	stats = new Stats();
	threejs_element.append(stats.dom);

	// resize when window resizes
	window.addEventListener( 'resize', resize_window, false );
}

function add_star_field(){
	texture_loader.load('/projects/planets/img/galaxy_starfield.png', function( map ) {
		var material	= new THREE.MeshBasicMaterial({
			map	: map,
			side : THREE.BackSide
		});
		var geometry	= new THREE.SphereGeometry(10000, 32, 32);
		var mesh	= new THREE.Mesh(geometry, material);
		mesh.rotation.z = Math.PI / 2;
		scene.add(mesh);
	});
}

function setup_controls(){
	controls = new THREE.TrackballControls(camera, renderer.domElement);
	controls.rotateSpeed = 5.0;
	controls.zoomSpeed = 5.0;
	controls.panSpeed = 1.0;
	controls.noZoom = false;
	controls.noPan = false;
	controls.staticMoving = true;
	controls.dynamicDampingFactor = 0.3;
	controls.keys = [ 65, 83, 68 ];
	controls.addEventListener('change', render);
}

// a recursive function that creates meshes for all bodies in planet_mesh_config
function add_planets(callback){

	var finished = 0;

	for (var name in planet_mesh_config) {
		if(planet_mesh_config.hasOwnProperty(name)) {

			var planet = planet_mesh_config[name];

			(function (planet) {
				texture_loader.load('/projects/planets/img/' + planet.img, function(map) {
					map.minFilter = THREE.LinearFilter; // clears error from images not 2:1
					var material	= new planet.texture({ map	: map});
					var geometry = new THREE.SphereGeometry(planet.radius, 32, 32);
					var mesh = new THREE.Mesh( geometry, material );

					scene.add(mesh);
					meshes[planet.name] = mesh;
					meshes[planet.name].rotation.x = Math.PI / 2;

					if(meshes_are_loaded()){
						callback();
					}
				});
			}(planet));
		}
	}
}

function resize_window() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
	controls.handleResize();
	render();
}

function meshes_are_loaded(){
	return (Object.keys(meshes).length === Object.keys(planet_mesh_config).length);
}

function update_mesh_positions(index){

	if(meshes_are_loaded()){
		// loop over planets updating the position of the mesh
		for(var i = 0; i < orbit_data.vectors.length; i++){
			planet = orbit_data.vectors[i];
			// mesh distances in milli AU
			meshes[planet.name].position.x = (planet.orbit[index].p[0]) * 1000;
			meshes[planet.name].position.y = (planet.orbit[index].p[1]) * 1000;
			meshes[planet.name].position.z = (planet.orbit[index].p[2]) * 1000;
		}

		if(controls){
			controls.target = meshes[ui.camera_focus].position.clone();
			controls.update();
		}
	}
}

function draw_cubic_bezier(points){

	var geometry = new THREE.SphereGeometry( 20, 32 );
	var material = new THREE.MeshBasicMaterial( { color: 0x77f442 } );

	// mark the control points
	for(var i = 0; i < points.length; i++){
		var circle = new THREE.Mesh( geometry, material );
		circle.position.set(points[i].x, points[i].y, points[i].z);
		scene.add(circle);
	}

	var curve = new THREE.CubicBezierCurve3(
		points[0],
		points[1],
		points[2],
		points[3]
	);

	var points = curve.getPoints( 50 );

	var geometry = new THREE.BufferGeometry().setFromPoints( points );
	var material = new THREE.LineBasicMaterial( { color : 0xffffff } );

	// Create the final object to add to the scene
	var curveObject = new THREE.Line(geometry, material);

	scene.add(curveObject);
}

function debug_box(){
	var geometry = new THREE.SphereGeometry( 20, 32 );
	var material = new THREE.MeshBasicMaterial( { color: 0xffffff } );

	var circle1 = new THREE.Mesh( geometry, material );
	circle1.position.set(-1000, -1000, -1000)
	scene.add( circle1 );

	var circle2 = new THREE.Mesh( geometry, material );
	circle2.position.set(1000, -1000, -1000)
	scene.add( circle2 );

	var circle3 = new THREE.Mesh( geometry, material );
	circle3.position.set(-1000, 1000, -1000)
	scene.add( circle3 );

	var circle4 = new THREE.Mesh( geometry, material );
	circle4.position.set(1000, 1000, -1000)
	scene.add( circle4 );

	var circle5 = new THREE.Mesh( geometry, material );
	circle5.position.set(-1000, -1000, 1000)
	scene.add( circle5 );

	var circle6 = new THREE.Mesh( geometry, material );
	circle6.position.set(1000, -1000, 1000)
	scene.add( circle6 );

	var circle7 = new THREE.Mesh( geometry, material );
	circle7.position.set(-1000, 1000, 1000)
	scene.add( circle7 );

	var circle8 = new THREE.Mesh( geometry, material );
	circle8.position.set(1000, 1000, 1000)
	scene.add( circle8 );
}
