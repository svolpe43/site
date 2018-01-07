
import os
from planets import get_next
from bottle import run, route, template, static_file, request, error

@route('/')
def home():
    return template('main', page='home')

'''
    Limbo
'''
@route('/limbo')
def limbo():
    return template('main', page='limbo')
@route('/limbo/img/<filename:path>')
def limbo(filename):
    return static_file(filename, root='limbo/img/')
@route('/limbo/<filename:path>')
def limbo(filename):
    return static_file(filename, root='limbo/')

'''
    Arc
'''
@route('/arc')
def arc():
    return template('arc')
@route('/arc/<filename:path>')
def arc(filename):
    return static_file(filename, root='arc/')

'''
    Cfsh
'''
@route('/cfsh')
def cfsh():
    return template('main', page='cfsh')
@route('/cfsh/img/<filename:path>')
def cfsh(filename):
    return static_file(filename, root='cfsh/img/')
@route('/cfsh/<filename:path>')
def cfsh(filename):
    return static_file(filename, root='cfsh/')

'''
    Pic-man
'''
@route('/picman')
def picman():
    return template('main', page='picman')

'''
    Projects
'''
@route('/projects')
def projects():
    return template('main', page='projects')
@route('/projects/<filename:path>')
def projects(filename):
    return static_file(filename, root='projects/')
@route('/projects/img/<filename:path>')
def projects(filename):
    return static_file(filename, root='projects/img/')

'''
    DeltaV
'''
@route('/projects/deltav')
def deltav():
    return template('main', page='projects/deltav')
@route('/projects/deltav/<filename:path>')
def deltav(filename):
    return static_file(filename, root='projects/deltav/')

'''
    Planets API
'''
@route('/projects/planets')
def planets():
    return template('main', page='projects/planets')
@route('/projects/planets/step')
def planets_step():
    return get_next(request.query.last)
@route('/projects/planets/<filename:path>')
def projects(filename):
    return static_file(filename, root='projects/planets/')

'''
    Astar
'''
@route('/projects/astar')
def astar():
    return template('main', page='projects/astar')
@route('/projects/astar/<filename:path>')
def arc(filename):
    return static_file(filename, root='projects/astar/')

'''
    Game of Life
'''
@route('/projects/gol')
def gol():
    return template('main', page='projects/gol')
@route('/projects/gol/<filename:path>')
def cfsh(filename):
    return static_file(filename, root='gol/')

'''
    Spaceform
'''
@route('/projects/spaceform')
def spaceform():
    return template('main', page='projects/spaceform')
@route('/projects/spaceform/img/<filename:path>')
def spaceform(filename):
    return static_file(filename, root='projects/spaceform/img/')

'''
    Minesweeper
'''
@route('/projects/ms')
def ms():
    return template('main', page='projects/ms')
@route('/projects/ms/<filename:path>')
def ms(filename):
    return static_file(filename, root='projects/ms/')

'''
    Static
'''
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

@error(404)
def error404(error):
    return template('main', page='404')

run(host='localhost', port=8080, debug=True)
