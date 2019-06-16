#!/bin/bash
export NODE_ENV=development
trap ctrl_c INT

function ctrl_c() {
  npx forever stop ./node_modules/.bin/ethereum-bridge > /dev/null 2>&1 &
  npx forever stop ./node_modules/.bin/ganache-cli > /dev/null 2>&1 &
  exit 0
}

npx forever stop ./node_modules/.bin/ethereum-bridge > /dev/null 2>&1 &
npx forever stop ./node_modules/.bin/ganache-cli > /dev/null 2>&1 &
echo "starting ganache..."
npx forever start ./node_modules/.bin/ganache-cli -m "CryptoShips" --networkId 999999999
sleep 5s
echo "starting ethereum-bridge..."
npx forever start ./node_modules/.bin/ethereum-bridge -H localhost:8545 -a 9 --dev
echo "compiling and migrating..."
npx truffle compile --all
npx truffle migrate --network development
echo "seeding..."
npx truffle exec lib/seed.js
echo "updating companion services..."
npm run update_contract_builds

echo -n "Running Blockchain on localhost:8545..."

while true; do
    sleep 1
done
