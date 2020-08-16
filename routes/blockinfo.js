const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");


var cron = require("node-cron");




const marketArray = ["USD/EUR", "JYP/USD", "USD/JYP", "NZD/USD", "AUD/CAD"];
var ramdomNumber = Math.floor(Math.random() * 5);
var blocks = [
  {
    name: "Block 1",
    market: marketArray[0],
    rate: Math.floor(Math.random() * (11 - 5)) + 5,
    clients: 3004,
    lot: 50,
  },
  {
    name: "Block 2",
    rate: Math.floor(Math.random() * (11 - 5)) + 15,
    market: marketArray[1],
    clients: 34373,
    lot: 100,
  },
  {
    name: "Block 3",
    rate: Math.floor(Math.random() * (11 - 5)) + 25,
    market: marketArray[2],
    clients: 44573,
    lot: 1000,
  },
  {
    name: "Block 4",
    rate: Math.floor(Math.random() * (11 - 5)) + 35,
    market: marketArray[3],
    clients: 95,
    lot: 10000,
  },
  {
    name: "Block 5",
    rate: Math.floor(Math.random() * (11 - 5)) + 45,
    market: marketArray[4],
    clients: 45,
    lot: 100000,
  },
];

const rateArray = [5, 15, 25, 35, 45];

var cors = require("cors");
router.use(cors());
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.route("/").get((req, res) => {
  cron.schedule(`*/20 * * * * *`, () => {
    blocks.forEach((data, index) => {
      data.market = marketArray[Math.floor(Math.random() * 5)];
      data.rate = Math.floor(Math.random() * (11 - 5)) + rateArray[index];
    });
  }).start;
  res.send("block info started");
});

router.route("/datas").get((req, res) => {
  res.send(blocks);
});


module.exports = router;
