
var gui;
var date_picker_folder;
var current_controller, day_controller, month_controller, year_controller, date_controller;
var orbit_controllers = {};

var months = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
var month_names = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'Novemebr', 'December'];
var bodies = ['Sun', 'Mercury', 'Venus', 'Earth', 'Mars'];

function UI(_date_change_handler) {

	var self = this;

	this.update_by_date(convert_date(new Date()));

	this.speed = 30;

	this.run = true;

	this.orbit = {
		show: false,
		run: false,
		index: 0,
		reset : reset_orbit,
		body: 'Earth',
		a: 1 * 1000,
		e: 0.01671022,
		i: 0.00005,
		ap: -11.26064,
		lan: 102.94719,
		By_Orbital_Elements: 0,
		By_Launch_Placement: 0,
		Radius: '',
		Velocity: '',
		Zenith: '',

		// for labels
		'1': '',
		'2': ''
	};

	this.camera_focus = 'Sun';
	this.stop_on_earth_mars_flyby = false;
	this.show_solar_system_plane = false;
	this.plot_planet_orbits = false;
	this.actual_planet_sizes = false;

	init_controls(this);

	this.date_change_handler = function(){
		// if we are running then we will update
		// on the next animation frame anyway
		if(!self.run){
			_date_change_handler();
		}
	}
};

UI.prototype.Start = function(){
	if(!this.run){
		this.run = true;
	}
}

UI.prototype.Stop = function(){
	this.run = false;
}

// call when any of the date controls changes
UI.prototype.update_by_date = function(date){
	if(date){
		var index = date_to_index(date);
		if(index){
			this.update_all(index, date);
		}
	}
}

// called when animating and incrementing date
UI.prototype.update_by_index = function(index){
	if(index !== null){
		var date = index_to_date(index);

		date[1] += 1; // 1 index the month

		if(date){
			this.update_all(index, date);
		}
	}
}

UI.prototype.update_all = function(index, date){

	var date_str = date.join('-');

	this.Date = date_str;
	this.Day = date[0];
	this.Month = date[1];
	this.Year = date[2];
	this.index = index;
	this.Current = date_str;

	if(current_controller){
		current_controller.setValue(month_names[this.Month - 1] + ' ' + this.Day + ',' + this.Year);
	}
}

UI.prototype.increment_index = function(is_up){
	if(is_up){
		var new_index;
		if(this.index < orbit_data.dates.length - 1){
			new_index = this.index + 1;
		}else{
			new_index = 0;
		}
		this.update_by_index(new_index);
	}
}

UI.prototype.update_orbit_state_vectors = function(orbit_vertex){
	orbit_controllers['r'].setValue(round(orbit_vertex.state[0], 3) + ' mAu');
	orbit_controllers['v'].setValue(round(orbit_vertex.state[1], 3) + ' km/s');
	orbit_controllers['z'].setValue(round(orbit_vertex.state[2], 3) + ' deg');
}

function convert_date(date){
	return [date.getUTCDate(), date.getUTCMonth(), date.getUTCFullYear()];
}

function init_controls(ui) {
	gui = new dat.GUI({width: 300});

	current_controller = gui.add(ui, 'Current', true);

	gui.add(ui, 'Start');
	gui.add(ui, 'Stop');

	// limited by webgl, max is 60 until we frame skip
	// set to 70 sto make sure it doesn't max out
	gui.add(ui, 'speed', 0, 70, 1).name('Speed (day/sec)');

	gui.add(ui, 'camera_focus', bodies).onChange(function(body){
		if(planets3js && !ui.run){
			planets3js.set_camera_focus(body);
		}
	}).name('Camera Focus');

	date_picker_folder = gui.addFolder('Date Chooser');

	date_controller = date_picker_folder.add(ui, 'Date').onChange(function(string){
		ui.update_by_date(string.split('-').map(Number));
		ui.date_change_handler();
	});

	year_controller = date_picker_folder.add(ui, 'Year', 1980, 2040, 1).onChange(function(){
		ui.update_by_date([ui.Day, ui.Month, ui.Year]);
		ui.date_change_handler();
	});

	month_controller = date_picker_folder.add(ui, 'Month', 1, 12, 1).onChange(function(){
		update_number_of_days();
		ui.update_by_date([ui.Day, ui.Month, ui.Year]);
		ui.date_change_handler();
	});

	day_controller = date_picker_folder.add(ui, 'Day', 1, 31, 1).onChange(function(){
		ui.update_by_date([ui.Day, ui.Month, ui.Year]);
		ui.date_change_handler();
	});

	date_picker_folder.open();

	var orbit_folder = gui.addFolder('Orbit Calculator');
	orbit_controllers['show'] = orbit_folder.add(ui.orbit, 'show').onChange(orbit_change).name('Show');
	orbit_controllers['run'] = orbit_folder.add(ui.orbit, 'run').onChange(play_orbit).name('Run');

	var objects = ['Mercury', 'Venus', 'Earth', 'Mars'];
	orbit_controllers['body'] = orbit_folder.add(ui.orbit, 'body', bodies).onChange(set_orbit).name('Body');
	orbit_folder.add(ui.orbit, '2', true).setValue('State Vectors');
	orbit_controllers['r'] = orbit_folder.add(ui.orbit, 'Radius', true);
	orbit_controllers['v'] = orbit_folder.add(ui.orbit, 'Velocity', true);
	orbit_controllers['z'] = orbit_folder.add(ui.orbit, 'Zenith', true);
	orbit_folder.add(ui.orbit, '1', true).setValue('Orbital Elements');
	orbit_controllers['a'] = orbit_folder.add(ui.orbit, 'a', 0, 2000, 10).onChange(orbit_change).name('Semi-Major Axis');
	orbit_controllers['e'] = orbit_folder.add(ui.orbit, 'e', 0, 1, 0.01).onChange(orbit_change).name('Eccentricity');
	orbit_controllers['i'] = orbit_folder.add(ui.orbit, 'i', 0, 360, 1).onChange(orbit_change).name('Inclination');
	orbit_controllers['ap'] = orbit_folder.add(ui.orbit, 'ap', 0, 360, 1).onChange(orbit_change).name('Argument of Periapsis');
	orbit_controllers['lan'] = orbit_folder.add(ui.orbit, 'lan', 0, 360, 1).onChange(orbit_change).name('Long. Ascending Node');
	orbit_folder.open();

	var fly_by_folder = gui.addFolder('Stop on Closest Fly By');
	fly_by_folder.add(ui, 'stop_on_earth_mars_flyby').name('Earth - Mars');
	fly_by_folder.open();

	var solar_system_plane_folder = gui.addFolder('Show Solar System Plane');
	solar_system_plane_folder.add(ui, 'show_solar_system_plane').onChange(function(e){
		if(planets3js){
			planets3js.toggle_solar_system_plane(e);
		}
	}).name('Show');
	solar_system_plane_folder.open();

	var orbit_plots_folder = gui.addFolder('Plot Planet Orbits');
	orbit_plots_folder.add(ui, 'plot_planet_orbits').onChange(function(e){
		if(planets3js){
			planets3js.toggle_plot_planet_orbits(e);
		}
	}).name('Show');
	orbit_plots_folder.open();

	var actual_planet_size_folder = gui.addFolder('Enable Accurate Planet Size Ratios');
	actual_planet_size_folder.add(ui, 'actual_planet_sizes').onChange(function(e){
		if(planets3js){
			planets3js.toggle_actual_planet_sizes(e);
		}
	}).name('On');
	actual_planet_size_folder.open();
}

function set_orbit(body){
	var show = ui.orbit.show;
	var ele = astro.get_orbital_elements(body);
	orbit_controllers['a'].setValue(ele.a);
	orbit_controllers['e'].setValue(ele.e);
	orbit_controllers['i'].setValue(ele.i);
	orbit_controllers['ap'].setValue(ele.ap);
	orbit_controllers['lan'].setValue(ele.lan);
	ui.orbit.show = show;
	planets3js.calculate_orbit();
	planets3js.draw_orbit();
}

function orbit_change(){
	if(planets3js){
		planets3js.calculate_orbit();
		planets3js.draw_orbit();
	}
}

function play_orbit(run){
	if(run){
		ui.orbit.index = 0;
		planets3js.clear_orbit();
	}
}

function reset_orbit(){
	ui.orbit.index = 0;
	planets3js.clear_orbit();
}

function update_number_of_days(){

	var max_days = months[ui.Month - 1];

	date_picker_folder.remove(day_controller);

	if(ui.Day > max_days){
		ui.Day = max_days;
	}

	day_controller = date_picker_folder.add(ui, 'Day', 1, max_days, 1).onChange(function(){
		console.log([ui.Day, ui.Month, ui.Year]);
		ui.update_by_date([ui.Day, ui.Month, ui.Year]);
		ui.date_change_handler();
	});
}

function index_to_date(index){
	var date = new Date(orbit_data.dates[index]);
	return [date.getUTCDate(), date.getUTCMonth(), date.getUTCFullYear()];
}

/*
	Performs binary search on orbit_data.dates array
	returns - index of the date given
	params - date - [day, month, year] (where day and month are 1 indexed)
*/
function date_to_index(date){

	var arr = orbit_data.dates;

	if(!valid_date(date)){
		return null;
	}

	// month is 0 indexed in Date input
	var needle = new Date(date[2], date[1] - 1, date[0]);

	var index = Math.floor(arr.length / 2);
	var start = 0;
	var end = arr.length;

	while(true){

		if(same_day(new Date(arr[index]), needle)){
			return index;
		}else if(start > end){
			return null;
		}

		if(Date.parse(arr[index]) > needle){
			end = index - 1;
		}else{
			start = index + 1;
		}

		index = Math.floor((start + end) / 2);
	}
}

function valid_date(date){
	for(var i = 0; i < date.length; i ++){
		if(date[i] < 1)
			return false;
	}

	if(date[0] > months[date[1] - 1])
		return false;

	if(date[1] > 12)
		return false;

	if(date[2] < 1980 || date[2] > 2040)
		return false;

	return true;
}

function same_day(d1, d2){
	return d1.getUTCFullYear() === d2.getUTCFullYear() &&
    d1.getUTCMonth() === d2.getUTCMonth() &&
    d1.getUTCDate() === d2.getUTCDate();
}

function round(number, precision) {
	var shift = function (number, precision, reverse_shift) {
		if (reverse_shift) {
			precision = -precision;
		}
		var numArray = ('' + number).split('e');
		return +(numArray[0] + 'e' + (numArray[1] ? (+numArray[1] + precision) : precision));
	};
	return shift(Math.round(shift(number, precision, false)), precision, true);
}
