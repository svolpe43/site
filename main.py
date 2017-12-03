
import os
from planets import get_next
from bottle import run, route, template, static_file, request

@route('/')
def home():
    return static_file('index.html', root='')

# SpaceX dv
@route('/deltav')
def deltav():
    return template('deltav')

# Planets API
@route('/planets')
def planets():
    return template('planets')
@route('/planets/step')
def planets_step():
	return get_next(request.query.last)

# Arc
@route('/arc')
def arc():
    return static_file('index.html', root='arc/')
@route('/arc/<filename:path>')
def arc(filename):
    return static_file(filename, root='arc/')

# Astar
@route('/astar')
def astar():
    return static_file('index.html', root='astar/')
@route('/astar/<filename:path>')
def arc(filename):
    return static_file(filename, root='astar/')

# Cfsh
@route('/cfsh')
def cfsh():
    return static_file('index.html', root='cfsh/')
@route('/cfsh/img/<filename:path>')
def cfsh(filename):
    return static_file(filename, root='cfsh/img/')
@route('/cfsh/<filename:path>')
def cfsh(filename):
    return static_file(filename, root='cfsh/')

# Game of Life
@route('/gol')
def gol():
    return static_file('index.html', root='gol/')
@route('/gol/<filename:path>')
def cfsh(filename):
    return static_file(filename, root='gol/')

# Limbo
@route('/limbo')
def limbo():
    return static_file('index.html', root='limbo/')
@route('/limbo/img/<filename:path>')
def limbo(filename):
    return static_file(filename, root='limbo/img/')
@route('/limbo/<filename:path>')
def limbo(filename):
    return static_file(filename, root='limbo/')

# Spaceform
@route('/spaceform')
def spaceform():
    return static_file('index.html', root='spaceform/')
@route('/spaceform/<filename:path>')
def spaceform(filename):
    return static_file(filename, root='spaceform/')

# Minesweeper
@route('/ms')
def ms():
    return static_file('index.html', root='ms/')
@route('/ms/<filename:path>')
def ms(filename):
    return static_file(filename, root='ms/')

# Static files
@route('/<filename:path>')
def send_static(filename):
    ext = os.path.splitext(filename)[1]
    if ext in ['.jpg', '.png', '.ico']:
        root = 'img/'
    elif ext == '.css':
        root = 'css/'
    elif ext =='.js':
        root = 'js/'
    return static_file(filename, root=root)

run(host='localhost', port=8080, debug=True)
