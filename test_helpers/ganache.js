const web3Utils = require("web3-utils");

const jsonrpc = '2.0';
const id = 0;

const TIME_UNITS = {
  seconds: 1,
  minutes: 60,
  hours: 3600,
  days: 86400
}

const send = (method, params = []) =>
  web3.currentProvider.send({ id, jsonrpc, method, params })

const fastForward = async (n, unit="seconds") => {
  if (!Object.keys(TIME_UNITS).includes(unit)) { throw `unknown unit ${unit}` }
  seconds = n * TIME_UNITS[unit];
  await send('evm_increaseTime', [seconds]);
  await send('evm_mine');
}

const blockHeight = async () => {
  const result = (await send('eth_blockNumber').result);
  return web3Utils.hexToNumber(result);
}

const waitForNewBlock = async ({ timeout: timeout } = { timeout: 20000 }) => {
  let _failed = false;
  let startingHeight = await blockHeight();
  let currentHeight;
  setTimeout(() => { _failed = true }, timeout);
  while(!_failed) {
    currentHeight = await blockHeight();
    if(currentHeight > startingHeight) {
      return true;
    }
  }
  raise("Time-out: new block never mined");
}

exports.fastForward = fastForward;
exports.blockHeight = blockHeight;
exports.waitForNewBlock = waitForNewBlock;
