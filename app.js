const express = require("express");

const crypto = require("crypto");


const app = express();
const port = process.env.PORT || 9000;


app.use("/", require("./routes/routes"));

app.listen(port, () => {
  console.log(`server is running on port: ${port}`);
});
