const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");

var cron = require("node-cron");
var firebase = require("firebase");

var cors = require("cors");
router.use(cors());
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

var trades = [
  {
    name: "gold",
    id: 1,
    start: 12,
    market: "usd/eur",
    return: 15,
    date: new Date().toLocaleDateString(),
    amount: 5000,
  },
  {
    name: "gold",
    id: 2,
    start: 12,
    market: "usd/eur",
    return: 15,
    date: new Date().toLocaleDateString(),
    amount: 200,
  },
];

var uniqueId;
var percentReturn;

var number = 0;
var block = [
  {
    name: "gold",
    id: number,
    start: 12,
    market: "usd/eur",
    return: 15,
    date: new Date().toLocaleDateString(),
  },
  {
    name: "gold",
    id: number,
    start: 12,
    market: "usd/eur",
    return: 15,
    date: new Date().toLocaleDateString(),
  },
];

router.route("/").get((req, res) => {
  // add trade and change id
  var addTrade = cron.schedule(`*/1 * * * *`, () => {
    //add trade function
    async function addnewTrade() {
      await block.push({
        name: "gold",
        id: number,
        start: 12,
        market: "usd/eur",
        return: 15,
        date: new Date().toLocaleDateString(),
      });
    }

    // chande id function
    async function updateId() {
      if (number == 2) {
        await (number = 1);
      } else {
        await (number = number + 1);
      }

      uniqueId = block[0].id;
      percentReturn = block[0].return;

      // add current array object value to trade transactions database
    }

    //get trade with unique id and add earnings to it
    async function rewardUsers() {
      await trades
        .filter((id) => id.id == uniqueId)
        .forEach((trade, index) => {
          let newamount = (trade.return / 100) * trade.amount;
          trade.amount = trade.amount + newamount;
        });
    }

    updateId()
      .then(() => {
        rewardUsers().then(() => {
          addnewTrade().then(() => {
            block = block.slice(1, 5); // remove first trade
            console.log(`block added ${number}`);
          });
        });
      })
      .catch((err) => res.send(err));
  }); // ended add trade and change id

  var startTime = cron.schedule(`*/20 * * * * *`, () => {
    block.forEach((val, index) => {
      if (val.start != 0) {
        val.start = val.start - 1;
      } else {
        null;
      }
    });
  });

  res.send("trade added id changed");
  addTrade.start();
  startTime.start();
});

router.route("/numbers").get((req, res) => {
  res.send(block);
});
router.route("/updates").get((req, res) => {
  res.send(trades);
});

module.exports = router;
