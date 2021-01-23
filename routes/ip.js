const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const publicIp = require("public-ip");
const wbm = require("wbm");
const whatsAppClient = require("@green-api/whatsapp-api-client");
const parsePhoneNumber = require("libphonenumber-js");
const fs = require("fs");
var geoip = require("geoip-lite");
var cors = require("cors");
router.use(cors());
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

const restAPI = whatsAppClient.restAPI({
  idInstance: "7195",
  apiTokenInstance: "a75b969af935ae6cbc1213c8e5f4d100607a72a82c471a43ef",
});

const phoneNumber = parsePhoneNumber("+855094749060");

const jsonnumber = [
  {
    "First Name": "Mike",
    "Middle Name": "",
    "Last Name": "peters",
    Nickname: "",
    "Mobile Phone": "+916351617653",
  },
  {
    "First Name": "tyson",
    "Middle Name": "",
    "Last Name": "fury",
    Nickname: "",
    "Mobile Phone": "+255784747557",
  },
];

var ipaddress;

router.route("/").get((req, res) => {
  var ip = async () => {
    ipaddress = await publicIp.v4();
    //=> '46.5.21.123'
  };
  ip().then(() => {
    var geo = geoip.lookup(ipaddress);
    res.send(geo);
  });
});

router.route("/country").post((req, res) => {
  const { ip } = req.body;
  var geo = geoip.lookup(ip);
  res.send(geo);
});

router.route("/number").get((req, res) => {
  /*  if (phoneNumber) {
    console.log({
      number: phoneNumber.number,
      country: phoneNumber.country,
      isValid: phoneNumber.isValid(),
      //    type: phoneNumber.getType(), // Note: `.getType()` requires `/max` metadata: see below for an explanation.
    });
  } */
  let data = JSON.stringify(jsonnumber, null, 2);

  //write file
  fs.writeFileSync("test.json", data);

  console.log(data);
  res.send("ok");
});

router.route("/wbm").get((req, res) => {
  wbm
    .start()
    .then(async () => {
      const phones = ["+916351617653"];
      const message = "Good Morning.";
      await wbm.send(phones, message);
      await wbm.end();
    })
    .catch((err) => console.log(err));
  res.send("ok");
});

router.route("/greenapi").get((req, res) => {
  restAPI.message
    .sendMessage(null, 255784747557, "hello world")
    .then((data) => {
      console.log(data);
    })
    .catch((err) => console.log(err));
  res.send("ok");
});

module.exports = router;
