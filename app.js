const express = require("express");

const crypto = require("crypto");

const app = express();
const port = process.env.PORT || 9000;

app.use("/", require("./routes/routes"));
app.use("/blocks", require("./routes/blocks"));

app.listen(port, () => {
  console.log(`server is running on port: ${port}`);
});
