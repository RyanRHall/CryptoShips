// Load ENV
require('dotenv').config();
// Libraries
const express = require("express");
const MoocParser = require("./MoocParser");
const ContractParser = require("./ContractParser");
const verifier = require("./verifier");

const app = express();

// Middleware to require query params
app.use(function (req, res, next) {
  const { verificationKey, contractAddress } = req.query;
  if (!verificationKey || !contractAddress) {
    res.json({ verified: "false" });
  } else {
    next();
  }
})

// Endpoint for tests
app.get('/test', async (req, res) => {
  const { verificationKey, contractAddress } = req.query;
  const valid = verificationKey.match(/^VALID_KEY/);
  const response = valid ? "true" : "false";
  res.json({ verified: response });
});

// Main endpoint
app.get('/', async (req, res) => {
  const { verificationKey, contractAddress } = req.query;
  const verificationData = await MoocParser.parse(verificationKey);
  const contractData = await ContractParser.parse(contractAddress);
  const valid = verifier.verify({ contractData, verificationData });
  const response = valid ? `${contractAddress}:${verificationKey}` : "false";
  res.json({ verified: response });
});



// if ([ "development", "test" ].includes(process.env.NODE_ENV)) {
//   app.get('/test', async (req, res) => {
//     const { verificationKey, contractAddress } = req.query;
//     if (verificationKey === "false") {
//       res.json({ verified: false });
//     } else if (verificationKey.match(/^TEST.*/)) {
//       res.json({ verified: `${contractAddress}:${verificationKey}` });
//     } else {
//       throw `unknown test verification key ${verificationKey}`;
//     }
//   });
// }

const port = process.env.NODE_ENV === "production" ? 80 : 8080;
app.listen(port);
