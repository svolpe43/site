
const AU = (149.6e6 * 1000) // 149.6 million km, in meters.

var camera, scene, renderer, controls, stats, animation_id, texture_loader;	

var objects = [];
var current;

$(document).ready(function(){

	console.log(orbit_data.length);
	init();
	//animate();
});

function init() {

	// setup camera
	camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 100000);
	camera.position.z = 400;
	camera.position.y = -3000;
	camera.rotation.x = 80 * Math.PI / 180;

	// configure texture loader
	texture_loader = new THREE.TextureLoader();

	// add mouse controls
	controls = new THREE.TrackballControls(camera);
	controls.rotateSpeed = 5.0;
	controls.zoomSpeed = 5.0;
	controls.panSpeed = 1.0;
	controls.noZoom = false;
	controls.noPan = false;
	controls.staticMoving = true;
	controls.dynamicDampingFactor = 0.3;
	controls.keys = [ 65, 83, 68 ];
	controls.addEventListener( 'change', render );

	scene = new THREE.Scene();

	// add lights to scene
	scene.add(new THREE.PointLight(0xffffff, 2, 1000000));
	scene.add(new THREE.AmbientLight(0x666666));

	// add planets to scene
	add_planets_rec(0);

	// add star field
	texture_loader.load('/projects/planets/threex.planets/images/galaxy_starfield.png', function( map ) {
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

	render();

	//current = initial;
	current = 0;
}

var planet_mesh_config = [
	// sun
	{
		name: 'Sun',
		color: '#ffeba5',
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

function add_planets_rec(index){

	if(index === planet_mesh_config.length){
		return;
	}

	var planet = planet_mesh_config[index];

	texture_loader.load('/projects/planets/threex.planets/images/' + planet.img, function(map) {
		var material	= new planet.texture({ map	: map});
		var geometry = new THREE.SphereGeometry(planet.radius, 32, 32);
		var mesh = new THREE.Mesh( geometry, material );

		scene.add(mesh);
		objects.push(mesh);

		add_planets_rec(index + 1);
	});
}

function animate() {
	
		current += 1

		animation_id = requestAnimationFrame(animate);

		// don't animate if we haven't finished loading all the planet textures
		if(objects.length !== planet_mesh_config.length){
			return;
		}

		for(var i = 0; i < current.length; i ++){
			objects[i].position.x = (current[i].px / AU) * 1000;
			objects[i].position.y = (current[i].py / AU) * 1000;
		}

		renderer.render(scene, camera);
		controls.update();
	});
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

var initial = [
	{
		'name': 'Sun',
		'mass': 1.98892e30,
		'px': 0,
		'py': 0,
		'vx': 0,
		'vy': 0
	},{
		'name': 'Mercury',
		'mass': .33e24,
		'px': 0.387 * AU,
		'py': 0,
		'vx': 0,
		'vy': -47.4 * 1000
	},{
		'name': 'Venus',
		'mass': 4.8685e24,
		'px': 0.723 * AU,
		'py': 0,
		'vx': 0,
		'vy': -35.02 * 1000
	},{
		'name': 'Earth',
		'mass': 5.9742e24,
		'px': -1 * AU,
		'py': 0,
		'vx': 0,
		'vy': 29.783 * 1000
	},{
		'name': 'Mars',
		'mass': .642e24,
		'px': 1.5234 * AU,
		'py': 0,
		'vx': 0,
		'vy': -24.1 * 1000
	}
]
