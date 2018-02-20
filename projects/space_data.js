
var rockets = {
	'falcon_9' : {
		name: 'Falcon 9',
		leo_payload: 20000,
		config: [
			'Liftoff',
			[296, 549000, 139500],
			'Stage Seperation',
			[348, 117000, 111000],
			'Fairing Jettison',
			[348, 106000, 4500]
		],
		payload_max: 50000
	},
	'falcon_heavy': {
		name: 'Falcon Heavy',
		leo_payload: 47000,
		config: [
			'Liftoff',
			[296, 1413000, 307350],
			'Booster Jettison',
			[296, 262350, 139500],
			'Core Jettison',
			[348, 117000, 111000],
			'Fairing Jettison',
			[348, 106000, 4500]
		],
		payload_max: 50000
	},
	'bfr': {
		name: 'BFR',
		leo_payload: 245000,
		config: [
			'Liftoff',
			[330, 6975000, 275000],
			'Booster Jettison',
			[375, 309850, 187000]
		],
		payload_max: 250000
	}
};

var dv_leo = 9400;
var dv_gto = 11500;
var dv_tli = 12660;
var dv_tmi = 13600;
var dv_tji = 15880;
var dv_tsi = 17020;

function dv_map(canvas_width, canvas_height){
	this.total = {
		x: canvas_width,
		y: canvas_height
	}

	this.half = {
		x: canvas_width / 2,
		y: canvas_height / 2
	}

	this.earth = {
		dim: 100,
		x: this.half.x,
		y: this.total.y - 100
	}

	this.moon = {
		delta_v: dv_tli,
		dim: 50,
		x: this.earth.x + 100,
		y: this.earth.y - 150
	}

	this.mars = {
		delta_v: dv_tmi,
		dim: 100,
		x: this.earth.x - 200,
		y: this.earth.y - 200
	}

	this.saturn = {
		delta_v: dv_tmi,
		dim: 100,
		x: this.earth.x + 150,
		y: this.earth.y - 350
	}

	this.jupiter = {
		delta_v: dv_tmi,
		dim: 100,
		x: this.earth.x - 200,
		y: this.earth.y - 500
	}

	this.hub = {
		x: this.earth.x,
		y: this.earth.y - 100
	}
}
