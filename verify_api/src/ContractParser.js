// setup environment
require('dotenv').config();
// libraries
const Web3 = require("web3");
// configure endpoint
const RINKEBY_ENDPOINT = `https://rinkeby.infura.io/${process.env.INFURA_API_KEY}`;
const DEV_ENDPOINT = "http://localhost:8545";
const PROVIDER_ENDPOINT = process.env.NODE_ENV === "production" ? RINKEBY_ENDPOINT : DEV_ENDPOINT;
// configure web3
const web3 = new Web3(new Web3.providers.HttpProvider(PROVIDER_ENDPOINT));

// parse function TODO:
async function parse(contractAddress) {

}

exports.parse = parse;
