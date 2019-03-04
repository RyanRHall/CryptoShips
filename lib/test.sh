export NODE_ENV=test
echo "starting ganache and ethereum-bridge"
npx forever start ./node_modules/.bin/ganache-cli
npx forever start ./node_modules/.bin/ethereum-bridge -H localhost:8545 -a 10
npx truffle test
echo "closing ganache and ethereum-bridge"
npx forever stop ./node_modules/.bin/ethereum-bridge
npx forever stop ./node_modules/.bin/ganache-cli
