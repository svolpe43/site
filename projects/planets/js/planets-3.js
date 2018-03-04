
var camera, scene, renderer, controls, stats, texture_loader;	
var meshes = {};
var solar_system_plane_mesh;

var planet_mesh_config = [
	{
		name: 'Sun',
		color: null,
		//radius: 100,
		radius: 75,
		texture: THREE.MeshBasicMaterial,
		img: 'sunmap.jpg'
	},{
		name: 'Mercury',
		color: null,
		//radius: 20,
		radius: 35,
		texture: THREE.MeshPhongMaterial,
		img: 'mercurymap.jpg'
	},{
		name: 'Venus',
		color: null,
		//radius: 40,
		radius: 35,
		texture: THREE.MeshPhongMaterial,
		img: 'venusmap.jpg'
	},{
		name: 'Earth',
		color: null,
		//radius: 40,
		radius: 35,
		texture: THREE.MeshPhongMaterial,
		img: 'earthmap1k.jpg'
	},{
		name: 'Mars',
		color: null,
		//radius: 25,
		radius: 35,
		texture: THREE.MeshPhongMaterial,
		img: 'marsmap1k.jpg'
	}
];

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

	// add planets to scene
	add_planets(0);

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
	controls.addEventListener('change', render);
}

// a recursive function that creates meshes for all bodies in planet_mesh_config
function add_planets(index){

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

		meshes[planet.name].rotation.x = Math.PI / 2;

		add_planets(index + 1);
	});
}

function add_orbit(){
	var curve = new THREE.EllipseCurve(
		0,  0,            // ax, aY
		1000, 1000,           // xRadius, yRadius
		0,  2 * Math.PI,  // aStartAngle, aEndAngle
		false,            // aClockwise
		0                 // aRotation
	);

	var points = curve.getPoints( 50 );
	var geometry = new THREE.BufferGeometry().setFromPoints( points );

	var material = new THREE.LineBasicMaterial( { color : 0xffffff } );

	// Create the final object to add to the scene
	var ellipse = new THREE.Line( geometry, material );
	scene.add(ellipse);
}

function resize_window() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
	controls.handleResize();
	render();
}

function meshes_are_loaded(){
	return (Object.keys(meshes).length === planet_mesh_config.length);
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
	}
}
