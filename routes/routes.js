const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
var cors = require("cors");

router.use(cors());
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.route("/").get((req, res) => {
    res.json({
        name: "nunnnn",
        about: "about"
    });
});

router.route("/cool").get((req, res) => {
    res.json({
        name: "nunnnn",
        about: "about"
    });
});

module.exports = router;
