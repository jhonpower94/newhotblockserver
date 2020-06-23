const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
var cors = require("cors");

var cron = require("node-cron");

var array = [1, 2];

router.use(cors());
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.route("/").get((req, res) => {
  var sec = new Date().getSeconds();
  var min = new Date().getMinutes();
  var hour = new Date().getHours();
  var day = new Date().getDay();

  const { id, name } = req.body;

  var task = cron.schedule(
    `*/${sec} * * * * *`,
    () => {
      var number = array.length + 1;
      array.push(number);
      console.log(`${sec} ${min} ${hour} ${day}`);
      res.json({ id: id, name: name });
      stoptask();
    },
    {
      scheduled: false,
    }
  );

  function stoptask() {
    task.destroy();
    console.log("destroyed task");
  }

  task.start();
});

router.route("/cool").get((req, res) => {
  res.send(array);
});

router.route("/test").post((req, res) => {
  const { seconds, minute } = req.body;
  res.json({ seconds: seconds, minute: minute });
});

module.exports = router;
