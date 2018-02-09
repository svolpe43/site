#!/bin/bash

rsync -avz --exclude '.git' ./ ubuntu@184.72.93.196:/home/ubuntu/site/

ssh ubuntu@184.72.93.196 << EOF
	sudo rm -rf /var/www/site/*
	sudo cp -r /home/ubuntu/site/* /var/www/site/
	sudo chown -R www-data:www-data /var/www/site
	sudo service apache2 restart
EOF
