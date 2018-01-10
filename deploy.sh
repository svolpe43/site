#!/bin/bash

rm -rf ~/site/*
rsync -avz --exclude '.git' ./ ubuntu@184.72.93.196:/home/ubuntu/site/
ssh ubuntu@184.72.93.196 sudo rm -rf /var/www/site/*
ssh ubuntu@184.72.93.196 sudo cp -r /home/ubuntu/site/* /var/www/site/
ssh ubuntu@184.72.93.196 sudo chown -R www-data:www-data /var/www/site
ssh ubuntu@184.72.93.196 sudo service apache2 restart