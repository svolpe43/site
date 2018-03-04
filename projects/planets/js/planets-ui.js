

var gui;
var date_picker_folder;
var current_controller, day_controller, month_controller, year_controller, date_controller;

var months = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

function UI(_date_change_handler) {

	var self = this;

	this.update_by_date(convert_date(new Date()));

	this.speed = 70;

	this.run = true;

	// show closest point
	this.stop_on_earth_mars_flyby = false;

	this.show_solar_system_plane = false;

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
	this.run = true;
}

UI.prototype.Stop = function(){
	this.run = false;
}

// Not Used: Doing any of these updates causes circular updates and max call stack error
UI.prototype.render = function(){
	date_controller.setValue([this.Day, this.Month, this.Year].join('-'));
	day_controller.setValue(this.Day);
	month_controller.setValue(this.Month);
	year_controller.setValue(this.Year);
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
		current_controller.setValue(date_str);
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

function convert_date(date){
	return [date.getUTCDate(), date.getUTCMonth(), date.getUTCFullYear()];
}

function init_controls(ui) {
	gui = new dat.GUI();

	current_controller = gui.add(ui, 'Current');

	gui.add(ui, 'Start');
	gui.add(ui, 'Stop');

	// limited by webgl, max is 60 until we frame skip
	// set to 70 sto make sure it doesn't max out
	gui.add(ui, 'speed', 0, 70, 1).name('Speed (day/sec)');

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

function same_day(d1, d2){
	return d1.getUTCFullYear() === d2.getUTCFullYear() &&
    d1.getUTCMonth() === d2.getUTCMonth() &&
    d1.getUTCDate() === d2.getUTCDate();
}
