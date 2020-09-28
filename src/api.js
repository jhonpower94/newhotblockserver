const express = require("express");
const bodyParser = require("body-parser");
var admin = require("firebase-admin");
const serverless = require("serverless-http");




const app = express();
const router = express.Router();

var cors = require("cors");

router.get("/", (req, res) => {
  res.send({
    hello: "hi",
  });
});

app.use("/.netlify/functions/api", router);

module.exports.handler = serverless(app);
