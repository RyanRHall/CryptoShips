#!/bin/sh
cd /home/ubuntu/verify_api/
npm install --production --unsafe-perm
npm run server:prod
