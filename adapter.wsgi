import sys, os

sys.path = ['/var/www/site/'] + sys.path
os.chdir(os.path.dirname(__file__))

import bottle, main # This loads your application

application = bottle.default_app()