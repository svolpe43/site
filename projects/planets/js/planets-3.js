
var camera, scene, renderer, controls, stats, texture_loader;	
var meshes = [];

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
	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

	// add live statistics
	stats = new Stats();
	document.body.appendChild(stats.dom);

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

function resize_window() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
	controls.handleResize();
	render();
}

function update_mesh_positions(index){
	// dont update position if we haven't loaded all meshes yet
	if(Object.keys(meshes).length === planet_mesh_config.length){
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
