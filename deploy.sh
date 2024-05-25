#!/bin/bash

rsync -avz --exclude '.git' ./ ubuntu@ec2-18-234-46-15.compute-1.amazonaws.com:/home/ubuntu/site/

ssh ubuntu@ec2-18-234-46-15.compute-1.amazonaws.com << EOF
	sudo rm -rf /var/www/site/*
	sudo cp -r /home/ubuntu/site/* /var/www/site/
	sudo chown -R www-data:www-data /var/www/site
	sudo service apache2 restart
EOF
