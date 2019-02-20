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

exports.fastForward = fastForward;
