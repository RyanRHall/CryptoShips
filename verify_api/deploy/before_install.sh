if [ -d /home/ubuntu/verify_api/ ]; then
    cd /home/ubuntu/verify_api/
    # stop server
    npm run server:stop
    # remove directory
    rm -rf /home/ubuntu/verify_api/
fi
mkdir /home/ubuntu/verify_api/
