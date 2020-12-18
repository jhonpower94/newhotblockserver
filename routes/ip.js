const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const publicIp = require("public-ip");
var geoip = require("geoip-lite");
var cors = require("cors");
router.use(cors());
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

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
  const {ip} = req.body;
  var geo = geoip.lookup(ip);
  res.send(geo);
});

module.exports = router;
