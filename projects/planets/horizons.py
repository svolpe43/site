
import sys, os, calendar, datetime, json, re

'''
Usage: python horizon.py

Finds the data files for the bodies in 'body_names'. Then loads all data
with the following structure and writes it to a timestamped file.

Times are in Barycentric Dynamical Time.

{
	dates: [
		'2000-01-01T00:00:00'
		...
	],
	vectors: [
		{
			name: Earth
			orbit: [
				{
					p: [<x>, <y>, <z>]
					v: [<x>, <y>, <z>]
				}
				...
			]
		}
		...
	]
}
'''

base_orbit_dir = './horizons/'
body_names = ['Sun', 'Mercury', 'Venus', 'Earth', 'Mars']
dates = []

def get_body_files(all_file_paths, body_name):
	pattern = re.compile('^' + body_name + '-')
	return [file_path for file_path in all_file_paths if pattern.match(file_path)]

def get_filenames():
	files = {}
	for body_name in body_names:
		files[body_name] = get_body_files(os.listdir(base_orbit_dir), body_name)
	return files

def parse_vector(line):
	arr = []
	for segment in line.split(' '):
		if(len(segment) < 5):
			continue
		num = segment.split('=')
		if(len(num) > 1):
			cleaned = num[1]
		else:
			cleaned = num[0]
		arr.append(float(cleaned))
	return arr

def parse_time(line):
	dt = line.split(' ')[3].split('-')
	return datetime.datetime(int(dt[0]), list(calendar.month_abbr).index(dt[1]), int(dt[2])).isoformat()

def parse_orbit(lines, add_dates):
	orbit = []
	i = 0
	while i < len(lines):
		if i % 4 == 0:
			snap = {
				'p': [],
				'v': []
			}
			j = 0
			while j < 4:
				if j == 0:
					if add_dates:
						dates.append(parse_time(lines[i + j]))
				elif j == 1:
					snap['p'] = parse_vector(lines[i + j])
				elif j == 2:
					snap['v'] = parse_vector(lines[i + j])
				else:
					orbit.append(snap)
				j += 1
			i += 4
	return orbit

def load_orbit(body, data_files):

	body_data = {
		'name': body,
		'orbit': []
	}

	num_lines = 0

	# only collect dates on the first body
	add_dates = len(dates) == 0

	for data_file in data_files:

		f = open(base_orbit_dir + data_file, 'r')
		lines = f.read().splitlines()
		f.close

		num_lines += len(lines)
		body_data['orbit'].extend(parse_orbit(lines, add_dates))
	return body_data

def load_orbits(bodies):
	orbits = []
	for body in bodies:
		body_data = load_orbit(body, bodies[body])
		orbits.append(body_data)
	return orbits

def inspect_data(data):
	print(str(len(data['dates'])) + ' dates')
	print('Start: ' + data['dates'][0])
	print('End: ' + data['dates'][len(data['dates']) - 1] + '\n')


	for body in data['vectors']:
		print(body['name'] + ' - ' + str(len(body['orbit'])) + ' days')

def write_to_file(data):
	time = str(datetime.datetime.now().strftime('%Y-%m-%d-%H:%M:%S'))
	f = open(base_orbit_dir + '../orbits/' + time + '-all.json', 'w')
	f.write('var orbit_data = ' + json.dumps(data, separators=(',',':')))
	f.close

files = get_filenames()
body_data = load_orbits(files)

data = {
	'dates': dates,
	'vectors': body_data
}

inspect_data(data)
write_to_file(data)



