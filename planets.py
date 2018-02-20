
'''
	planets.py

	The script takes in a state of the solar system with velocities and positions of planets
	and returns the next state after some given increment of time.

'''

import math
import json

G = 6.67428e-11			# Gravity G

hour_secs = 60 * 60
day_secs = 24 * hour_secs
month_secs = day_secs * 30

au = (149.6e6 * 1000)	# 149.6 million km, in meters.
scale = 250 / au 		# scale is 100 pixels = 1AU.

class Body():

    # kg, m/s, m
    
    # Initial values
    name = 'Body'
    mass = None
    vx = vy = 0.0
    px = py = 0.0
    
    # Returns the force between itself and another body
    def attraction(self, other):

        # Report an error if the other object is the same as this one.
        if self is other:
            raise ValueError(
            	"Attraction of object %r to itself requested"
                             % self.name)

        # Compute the distance of the other body.
        dx = (other.px - self.px)
        dy = (other.py - self.py)
        d = math.sqrt(dx**2 + dy**2)

        # Error if the objects collide
        if d == 0:
            raise ValueError(
            	"Collision between objects %r and %r"
                             % (self.name, other.name))

        # Compute the force of attraction
        f = G * self.mass * other.mass / (d**2)

        # Compute the direction of the force
        theta = math.atan2(dy, dx)
        fx = math.cos(theta) * f
        fy = math.sin(theta) * f
        return fx, fy

def step(bodies):

	# the time period to step to
    timestep = day_secs

    # Compute the total force of each body
    force = {}
    for body in bodies:

        # Add up all of the forces exerted on 'body'.
        total_fx = total_fy = 0.0
        for other in bodies:

            if body is other:
                continue

            fx, fy = body.attraction(other)
            total_fx += fx
            total_fy += fy

        # Record the total force exerted.
        force[body] = (total_fx, total_fy)

    # Update velocities based upon on the force.
    for body in bodies:
        fx, fy = force[body]
        body.vx += fx / body.mass * timestep
        body.vy += fy / body.mass * timestep

        # Update positions
        body.px += body.vx * timestep
        body.py += body.vy * timestep

    return bodies

def get_next(last):

	# the last set of data
	data = json.loads(last)

	print data

	bodies = []
	for obj in data:

		print obj

		body = Body()
		body.name = obj[u'name']
		body.mass = obj[u'mass']
		body.px = obj[u'px']
		body.py = obj[u'py']
		body.vx = obj[u'vx']
		body.vy = obj[u'vy']
		bodies.append(body)

	updated_bodies = step(bodies)

	next = []
	for body in updated_bodies:
		obj = {}
		obj['name'] = body.name
		obj['mass'] = body.mass
		obj['px'] = body.px
		obj['py'] = body.py
		obj['vx'] = body.vx
		obj['vy'] = body.vy
		next.append(obj)

	# return the new set of data
	return json.dumps(next)
