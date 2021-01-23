const express = require("express");


const crypto = require("crypto");

const app = express();
const port = process.env.PORT || 9000;

app.use("/", require("./routes/routes"));
app.use("/blocks", require("./routes/blocks"));
app.use("/blockinfo", require("./routes/blockinfo"));
app.use("/ip", require("./routes/ip"));
app.use("/mail", require("./routes/mailer"));

app.listen(port, () => {
  console.log(`server is running on port: ${port}`);
});
