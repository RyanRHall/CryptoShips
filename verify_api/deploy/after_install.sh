#!/bin/sh
cd /home/ubuntu/app/
npm install --production --unsafe-perm
npm run server:prod
