
/*
	var a = 1000; // 5536635.97827
	var e = 0; // 0.260350152613
	var i = 0; // 7.16528963794e-06
	var ap = 0 // -1.57079632679
	var lan = 0; // -1.57079632679
*/

const AU = 149.6e6 * 1000; // 149.6 billion meters
const PI = 3.14159265359;
const G = 6.67259e-11;
const sec_in_earth_day = 86400;
const MS = 1.989e30;

function Astro(){}

Astro.prototype.plot_orbit = function(a, e, i, ap, lan){

	// iterate over the eccentric anamoly calculating vertices
	var vertices = [];
	for(var ea = 0; ea < 360; ea += .1){
		var EA = deg_to_rad(ea);
		var vertex = {
			position: kep_to_cart((a / 1000) * AU, e, deg_to_rad(i), deg_to_rad(ap), deg_to_rad(lan), EA),
			state: kep_to_state((a / 1000) * AU, e, i, ap, lan, EA)
		}
		vertices.push(vertex);
	}

	//return vertices;
	return earth_day_resolution(vertices);
}

Astro.prototype.get_orbital_elements = function(body){
	return body_data[body].orbit;
}

// calculates the state vectors of a body from orbital elements
function kep_to_state(a, e, i, ap, lan, EA){

	var ta = 2 * Math.atan(Math.sqrt((1 + e) / (1 - e)) * Math.tan(EA / 2));

	var r = (a * (1 - Math.pow(e, 2))) / (1 + (e * Math.cos(ta)));
	var v = Math.sqrt(G * MS * ((2/r) - (1/a)));
	var z = Math.atan((e * Math.sin(ta)) / (1 + (e * Math.cos(ta))));

	return[r, v, z];

}

// calculates the cartesian position values from orbital elements
function kep_to_cart(a, e, i, ap, lan, EA){

	// calculate true anomaly and radius
	// tan  = (r1 × v1^2 / GM) × sin  × cos  / [(r1 × v1^2 / GM) × sin2  - 1]
	var ta = 2 * Math.atan(Math.sqrt((1 + e) / (1 - e)) * Math.tan(EA / 2));
	var r = a * (1 - e * Math.cos(EA))

	var x = r * (Math.cos(lan) * Math.cos(ap + ta) - Math.sin(lan) * Math.sin(ap + ta) * Math.cos(i))
    var y = r * (Math.sin(lan) * Math.cos(ap + ta) + Math.cos(lan) * Math.sin(ap + ta) * Math.cos(i))
    var z = r * (Math.sin(i) * Math.sin(ap + ta))

    // calc T with MA = np.sqrt(mu/(a**3)) * (0 - T)
    var MA = EA - e * Math.sin(EA);
	var T = (MA) / (Math.sqrt((G * MS) / (Math.pow(a, 3)) ));

    return [(x / AU) * 1000, (y / AU) * 1000, (z / AU) * 1000, T];
}

// calculates the orbital elements from posisiton and velocity vectors
function state_to_kep(r, v, z, b, s, d){

	var en = (r * Math.pow(v, 2)) / (G * MS);

	var a = 1 / ((2 / r) - (Math.pow(v, 2) / (G * MS)));
	var e = Math.sqrt(Math.pow((en - 1), 2) * Math.pow(Math.cos(z), 2) + Math.pow(Math.sin(z), 2));
	var i = Math.acos(Math.cos(s) * Math.sin(b));

	var da = Math.atan(Math.sin(s) * Math.tan(b));
	var l = Math.atan(Math.tan(s) / Math.cos(b));
	var ta = Math.atan((en * Math.cos(z) * Math.sin(z)) / (en * Math.pow(Math.cos(z), 2) - 1));

	var ap = l - ta;
	var lan = d - da;
	var EA = Math.acos((-(r / a) + 1) / e);
}

// takes in an array of vertices and returns a new list
// of vertices with 1 earth day time delta between each
function earth_day_resolution(vertices){

	var new_vertices = [];
	var i = 0;

	while(true){

		var cur_time = vertices[i].position[3];
		new_vertices.push(vertices[i]);

		while(vertices[i].position[3] - cur_time < sec_in_earth_day - 300){
			i++;
			if(i >= vertices.length){
				return new_vertices;
			}
		}
	}
}

// converts degree to radians
function deg_to_rad(deg){
	return (deg / 180) * PI;
}

/*
var astro = new Astro();
var verts = astro.plot_orbit(1 * 1000, 0.01671022, 0.00005, -11.26064, 102.94719);
var last_time = 0;
for(var i = 0; i < verts.length; i++){
	console.log(verts[i].position[3], verts[i].position[3] - last_time);
	last_time = verts[i].position[3];
}
*/

/*
	a - semi-major axis (mAU)
	e - eccentricity
	i - inclination
	ap - Argument of Periapsis
	lan - Longitude of Ascending Node
*/
var body_data = {
	'Sun': {
		orbit: {
			a: 10,
			e: 0.01671022,
			i: 0.00005,
			ap: -11.26064,
			lan: 102.94719,
		}
	},
	'Mercury': {
		orbit: {
			a: 0.38709893 * 1000,
			e: 0.20563069,
			i: 7.00487,
			ap: 48.33167,
			lan: 77.45645
		}
	},
	'Venus': {
		orbit: {
			a: 0.72333199 * 1000,
			e: 0.00677323,
			i: 3.39471,
			ap: 76.68069,
			lan: 131.53298
		}
	},
	'Earth': {
		orbit: {
			a: 1 * 1000,
			e: 0.01671022,
			i: 0.00005,
			ap: -11.26064,
			lan: 102.94719
		}
	},
	'Mars': {
		orbit: {
			a: 1.52366231 * 1000,
			e: 0.09341233,
			i: 1.85061,
			ap: 49.57854,
			lan: 336.04084
		}
	},
};