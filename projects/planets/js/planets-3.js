
var camera, scene, renderer, controls, stats, texture_loader;	
var meshes = [];

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
