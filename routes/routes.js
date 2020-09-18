const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
var admin = require("firebase-admin");
var firebase = require("firebase");

var serviceAccount = require("./config/serviceaccount.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://admin-fa3ba.firebaseio.com",
});

var cors = require("cors");
router.use(cors());
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

const firebaseConfig = {
  apiKey: "AIzaSyClFdUmgFY5e6Y_GMkA02a2LWP0ML7IG-A",
  authDomain: "admin-fa3ba.firebaseapp.com",
  databaseURL: "https://admin-fa3ba.firebaseio.com",
  projectId: "admin-fa3ba",
  storageBucket: "admin-fa3ba.appspot.com",
  messagingSenderId: "554107235093",
  appId: "1:554107235093:web:ddb295c6cffdcc2ae4571c"
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
  const {
    blockindex,
    deposit_amount,
    userid,
    depositid,
    duration,
    rate,
  } = req.body;
  const rt_amount = (rate / 100) * deposit_amount + deposit_amount;
  

  firestor
    .doc(`users/${userid}`)
    .collection("deposits")
    .doc(depositid)
    .update({
      complete: true,
      return_amount: rt_amount,
      percentage: rate,
    })
    .then(() => {
      firestor.doc(`users/${userid}`).collection("notification").add({
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        amount: rt_amount,
        type: "investment",
      });
    });

  res.send({
    status: "ok",
  });
});

router.route("/delete").post((req, res) => {
  const { uid } = req.body;
  admin
    .auth()
    .deleteUser(uid)
    .catch(function (error) {
      console.log("Error deleting user", uid, error);
    });
  res.send({
    uid: uid,
  });
});

module.exports = router;
