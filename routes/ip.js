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
    res.send(geoip.lookup(ipaddress));
  });
});

module.exports = router;
