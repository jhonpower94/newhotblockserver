const express = require("express");
const bodyParser = require("body-parser");
var cors = require("cors");
const crypto = require("crypto");

const app = express();
const port = process.env.PORT || 9000;

app.get("/", (_, res) => {
  res.send("hotblock api server");
});

app.listen(port, () => {
  console.log(`server is running on port: ${port}`);
});
