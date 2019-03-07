if [ -d /home/ubuntu/app/ ]; then
    cd /home/ubuntu/app/
    # stop server
    npm run server:stop
    # remove directory
    rm -rf /home/ubuntu/app/
fi
mkdir /home/ubuntu/app/
