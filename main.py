
import os
from planets import get_next
from bottle import run, route, template, static_file, request

@route('/')
def home():
    return template('main', page='home')

# Limbo
@route('/limbo')
def limbo():
    return template('main', page='limbo')
@route('/limbo/img/<filename:path>')
def limbo(filename):
    return static_file(filename, root='limbo/img/')
@route('/limbo/<filename:path>')
def limbo(filename):
    return static_file(filename, root='limbo/')

# Arc
@route('/arc')
def arc():
    return template('arc')
@route('/arc/<filename:path>')
def arc(filename):
    return static_file(filename, root='arc/')

# Cfsh
@route('/cfsh')
def cfsh():
    return template('main', page='cfsh')
@route('/cfsh/img/<filename:path>')
def cfsh(filename):
    return static_file(filename, root='cfsh/img/')
@route('/cfsh/<filename:path>')
def cfsh(filename):
    return static_file(filename, root='cfsh/')

# Picman
@route('/picman')
def picman():
    return template('main', page='picman')

# Projects
@route('/projects')
def projects():
    return template('main', page='projects')
@route('/projects/<filename:path>')
def projects(filename):
    return static_file(filename, root='projects/img/')

# SpaceX dv
@route('/projects/deltav')
def deltav():
    return template('main', page='projects/deltav')

# Planets API
@route('/projects/planets')
def planets():
    return template('main', page='projects/planets')
@route('/projects/planets/step')
def planets_step():
	return get_next(request.query.last)

# Astar
@route('/projects/astar')
def astar():
    return template('main', page='projects/astar')
@route('/astar/<filename:path>')
def arc(filename):
    return static_file(filename, root='astar/')

# Game of Life
@route('/projects/gol')
def gol():
    return template('main', page='projects/gol')
@route('/gol/<filename:path>')
def cfsh(filename):
    return static_file(filename, root='gol/')

# Spaceform
@route('/projects/spaceform')
def spaceform():
    return template('main', page='spaceform')
@route('/spaceform/img/<filename:path>')
def spaceform(filename):
    return static_file(filename, root='spaceform/img/')

# Minesweeper
@route('/projects/ms')
def ms():
    return template('main', page='projects/ms')
@route('/ms/<filename:path>')
def ms(filename):
    return static_file(filename, root='ms/')

# Static files
@route('/<filename:path>')
def send_static(filename):
    ext = os.path.splitext(filename)[1]
    root = ''
    if ext in ['.jpg', '.png', '.ico']:
        root = 'img/'
    elif ext == '.css':
        root = 'css/'
    elif ext =='.js':
        root = 'js/'
    return static_file(filename, root=root)

run(host='localhost', port=8080, debug=True)
