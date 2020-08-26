const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
var firebase = require("firebase");
const { Convert } = require("easy-currencies");

var cors = require("cors");
router.use(cors());
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

const firebaseConfig = {
  apiKey: "AIzaSyAvue4Nuo9hVT9ex5TGGsx0EB-fDxkATbQ",
  authDomain: "hotblock-48cbf.firebaseapp.com",
  databaseURL: "https://hotblock-48cbf.firebaseio.com",
  projectId: "hotblock-48cbf",
  storageBucket: "hotblock-48cbf.appspot.com",
  messagingSenderId: "569044229872",
  appId: "1:569044229872:web:2ef373868892454c286c35",
  measurementId: "G-VS2EM66FF2",
};
const app = firebase.initializeApp(firebaseConfig);
const firestor = app.firestore(app);

var cron = require("node-cron");

const marketArray = ["USD/EUR", "JYP/USD", "USD/JYP", "NZD/USD", "AUD/CAD"];

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

router.route("/").get((req, res) => {
  cron.schedule(`*/20 * * * * *`, () => {
    blocks.forEach((data, index) => {
      data.market = marketArray[Math.floor(Math.random() * 5)];
      data.rate = Math.floor(Math.random() * (11 - 5)) + rateArray[index];
    });
  }).start;
  res.send("block info started");
});

router.route("/blocks").get((req, res) => {
  res.send(array);
});

router.route("/ipn").post((req, res) => {
  const { blockindex, deposit_amount, userid, depositid, duration } = req.body;
  const rt_amount = (blocks[blockindex].rate / 100) * deposit_amount + deposit_amount ;
  var task = cron.schedule(`* */${duration} * * *`, () => {
    firestor
      .doc(`users/${userid}`)
      .collection("deposits")
      .doc(depositid)
      .update({
        complete: true,
        return_amount: rt_amount,
        percentage: blocks[blockindex].rate,
      })
      .then(() => {
        firestor.doc(`users/${userid}`).collection("notification").add({
          date: new Date().toLocaleDateString(),
          time: new Date().toLocaleTimeString(),
          amount: rt_amount,
          type: "investment"
        });
      })
      .then(() => {
        stopTask();
      });
  });

  function stopTask() {
    return task.destroy();
  }

  task.start();

  res.send({
    blockindex: blockindex,
    deposit_amount: deposit_amount,
    userid: userid,
  });
});

module.exports = router;
