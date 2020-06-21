const express = require("express");
const bodyParser = require("body-parser");
var cors = require("cors");
const crypto = require("crypto");

const app = express();
const port = process.env.PORT || 9000;

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/", require("./routes/routes"));

app.listen(port, () => {
  console.log(`server is running on port: ${port}`);
});
