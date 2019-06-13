module.exports = {
  networks: {
    development: {
     host: "127.0.0.1",
     port: 8545,
     network_id: "*",
    },
    test: {
     host: "127.0.0.1",
     port: 7545,
     network_id: "*",
    }
  },
  mocha: {
    timeout: 100000
  },
  compilers: {
    solc: {
      version: "0.4.25"
    }
  }
}
