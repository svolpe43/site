
import sys, os, calendar, datetime, json

'''
Usage: python horizon.py <orbit>

Empty <orbit> parameter loads all orbit files in ./orbits/
'''

base_orbit_dir = './orbits/'

orbit_names = []
if len(sys.argv) > 1:
	orbit_names.append(sys.argv[1])
else:
	orbit_names = os.listdir(base_orbit_dir)

class Snapshot():
	time = 0
	p = []
	v = []

def parse(line):
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

def load_orbit(orbit):

	data = {
		'name': orbit,
		'orbit': []
	}

	f = open(base_orbit_dir + orbit, 'r')
	lines = f.read().splitlines()
	f.close

	i = 0
	print('Loading ' + str(len(lines)) + ' days for ' + orbit)

	while i < len(lines):
	    if i % 4 == 0:
	    	snap = {
	    		'time': 0,
	    		'p': [],
	    		'v': []
	    	}
	    	j = 0
	    	while j < 4:
	    		if j == 0:
	    			snap['time'] = parse_time(lines[i + j])
	    		elif j == 1:
	    			snap['p'] = parse(lines[i + j])
	    		elif j == 2:
	    			snap['v'] = parse(lines[i + j])
	    		else:
	    			data['orbit'].append(snap)
	    		j += 1
	    	i += 4
	    i += 1

	print('start: ' + str(data['orbit'][0]['time']))
	print('end: ' + str(data['orbit'][len(data['orbit']) - 1]['time']) + '\n')

	return data

def load_orbits():
	return [load_orbit(orbit_name) for orbit_name in orbit_names]

f = open(base_orbit_dir + '../all.json', 'w')
f.write(json.dumps(load_orbits(), separators=(',',':')))
f.close
