#!/bin/bash
export NODE_ENV=test
echo "starting ganache..."
npx forever start ./node_modules/.bin/ganache-cli -m "CryptoShips" > /dev/null 2>&1 &
# TODO way to avoid hard-coded waits?
sleep 5s
echo "starting ethereum-bridge..."
npx forever start ./node_modules/.bin/ethereum-bridge -H localhost:8545 -a 9 --dev > /dev/null 2>&1 &
sleep 40s
npx truffle test "$@"
echo "closing ganache and ethereum-bridge"
npx forever stop ./node_modules/.bin/ethereum-bridge > /dev/null 2>&1 &
npx forever stop ./node_modules/.bin/ganache-cli > /dev/null 2>&1 &
