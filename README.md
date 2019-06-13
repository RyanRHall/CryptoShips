# CryptoShips

Have you ever thought to yourself, "man, I wish more people would learn to \_\_\_\_\_\_\_\_\_\_." Maybe you think the world needs more [diplomats], [data scientists], or [blockchain engineers]. CryptoShips is an ongoing project that enables users to sponsor and receive scholarships to Massive Open Online Courses (MOOCs) using cryptocurrencies! With CryptoShips, you can incentivize the next generation of students by sponsoring the courses you want more people to take.

### Tools used
  * [Truffle]
  * [Drizzle]
  * [Oraclize]
  * [React]
  * [Puppeteer]
  * [Express]

### Architecture

This system is composed of three pieces:
  * Ethereum smart contracts
  * [A front-end application][CryptoShips Frontend]
  * [A verification API][CryptoShips API]

![Architecture Diagram][architecture_diagram]

## Installation

Prerequisits:

  * Node 10 +

```
# clone
git clone https://github.com/RyanRHall/CryptoShips.git && cd CryptoShips
# install dependencies
npm run setup
# test
npm run test
```

## To-Dos:

* [ ] Convert to upgradeable contracts using zeppelinOS
* [ ] Upgrade to oraclize api 0.5 and switch to #strConcat
* [ ] Use zeppelinOS for package management
  * [ ] Use revert reasons
* [ ] Build out front end
* [ ] Add mock functionality to test UI on dev/testnets
* [ ] Host frontend


<!-- Links -->

[architecture_diagram]: docs/architecture_diagram.png "Architecture Diagram"

[Truffle]: https://github.com/trufflesuite/truffle
[Drizzle]: https://github.com/trufflesuite/drizzle
[React]: https://github.com/facebook/react
[Puppeteer]: https://github.com/GoogleChrome/puppeteer
[Express]: https://github.com/expressjs/express
[Oraclize]: https://github.com/oraclize/ethereum-api

[diplomats]: https://www.coursera.org/learn/global-diplomacy
[data scientists]: https://www.coursera.org/learn/python-data-analysis
[blockchain engineers]: https://www.coursera.org/learn/blockchain-foundations-and-use-cases

[CryptoShips API]: https://github.com/RyanRHall/CryptoShipsVerifyAPI
[CryptoShips Frontend]: https://github.com/RyanRHall/CryptoShipsFrontend
