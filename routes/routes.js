const express = require("express");
const docData = require("rxfire/firestore");
const router = express.Router();
const bodyParser = require("body-parser");
var random = require("random-key-generator");
var admin = require("firebase-admin");
var firebase = require("firebase");
var Fakerator = require("fakerator");

var serviceAccount = require("./config/serviceaccount.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://hotblockinvest.firebaseio.com",
});

var cors = require("cors");
router.use(cors());
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

const firebaseConfig = {
  apiKey: "AIzaSyAhzbLFtj3J_ubXZmtkVH61S3aqbzHfK2Y",
  authDomain: "hotblockinvest.firebaseapp.com",
  databaseURL: "https://hotblockinvest.firebaseio.com",
  projectId: "hotblockinvest",
  storageBucket: "hotblockinvest.appspot.com",
  messagingSenderId: "468239244770",
  appId: "1:468239244770:web:035adf1ad39d02a9ea2dbb",
};
const app = firebase.initializeApp(firebaseConfig);
const firestor = app.firestore(app);

var CronJob = require("cron").CronJob;
var CronJobManager = require("cron-job-manager");

router.route("/").get(async (req, res) => {
  const getHour = `${Date.now()}`;
  const getdatas = firestor.collection("plans").doc("12345");
  const doc = await getdatas.get();
  if (!doc.exists) {
    console.log("No such document!");
  } else {
    const oldDataplan1 = doc.data().plan1;
    const oldDataplan3 = doc.data().plan3;
    const oldDataplan2 = doc.data().plan2;

    const sliceDataplan1 = oldDataplan1.slice(0, 8);
    const sliceDataplan3 = oldDataplan3.slice(0, 8);
    const sliceDataplan2 = oldDataplan2.slice(0, 8);

    sliceDataplan1.splice(0, 0, {
      value: Math.floor(Math.random() * (10 - 25)) + 25,
      trade: "plan1",
      time: getHour,
    });
    sliceDataplan2.splice(0, 0, {
      value: Math.floor(Math.random() * (35 - 50)) + 50,
      trade: "plan2",
      time: getHour,
    });
    sliceDataplan3.splice(0, 0, {
      value: Math.floor(Math.random() * (60 - 95)) + 95,
      trade: "plan3",
      time: getHour,
    });

    firestor
      .doc(`plans/${12345}`)
      .update({
        plan1: sliceDataplan1,
        plan2: sliceDataplan2,
        plan3: sliceDataplan3,
      })
      .catch((err) => console.log(err));

    /*  console.log("Document data:", oldData);
    console.log("sliced data:", sliceData); */
  }

  res.send("block info updated");
});

router.route("/setplans").get((req, res) => {
  firestor
    .doc(`plans/${12345}`)
    .update({
      plan1: [
        { trade: "plan1", time: "1", value: 75 },
        { trade: "plan1", time: "2", value: 80 },
        { trade: "plan1", time: "3", value: 77 },
        { trade: "plan1", time: "4", value: 91 },
        { trade: "plan1", time: "5", value: 88 },
        { trade: "plan1", time: "6", value: 80 },
        { trade: "plan1", time: "7", value: 75 },
        { trade: "plan1", time: "8", value: 95 },
        { trade: "plan1", time: "9", value: 85 },
      ],
      plan2: [
        { trade: "plan2", time: "1", value: 55 },
        { trade: "plan2", time: "2", value: 60 },
        { trade: "plan2", time: "3", value: 64 },
        { trade: "plan2", time: "4", value: 70 },
        { trade: "plan2", time: "5", value: 69 },
        { trade: "plan2", time: "6", value: 55 },
        { trade: "plan2", time: "7", value: 60 },
        { trade: "plan2", time: "8", value: 58 },
        { trade: "plan2", time: "9", value: 60 },
      ],
      plan3: [
        { trade: "plan3", time: "1", value: 30 },
        { trade: "plan3", time: "2", value: 49 },
        { trade: "plan3", time: "3", value: 54 },
        { trade: "plan3", time: "4", value: 50 },
        { trade: "plan3", time: "5", value: 40 },
        { trade: "plan3", time: "6", value: 39 },
        { trade: "plan3", time: "7", value: 35 },
        { trade: "plan3", time: "8", value: 48 },
        { trade: "plan3", time: "9", value: 38 },
      ],
    })
    .then(() => {
      res.send({ status: "ok" });
    })
    .catch((err) => console.log(err));
});

router.route("/plans").post((req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  const {
    blockindex,
    deposit_amount,
    userid,
    depositid,
    duration,
    rate,
  } = req.body;

  firestor.collection("investments").add({
    blockindex: blockindex,
    deposit_amount: deposit_amount,
    userid: userid,
    depositid: depositid,
    duration: duration,
    rate: rate,
    Checkduration: 1,
  });
  res.send(req.body);
});

router.route("/ipn").get((req, res) => {
  firestor
    .collection("investments")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const newdp = parseInt(doc.data().deposit_amount);
        const newrate = parseInt(doc.data().rate);
        const rt_amount = (newrate / 100) * newdp + newdp;

        const duration = doc.data().duration;
        const Checkduration = doc.data().Checkduration;

        if (Checkduration === duration) {
          firestor
            .doc(`users/${doc.data().userid}`)
            .collection("deposits")
            .doc(doc.data().depositid)
            .update({
              complete: true,
              return_amount: rt_amount,
            })
            .then(() => {
              // get user wallet balance
              /*  firestor
                .doc(`users/${doc.data().userid}`)
                .get()
                .then((data) => {
                  const wallet = data.data().wallet_balance;
                  const newWalleyAmount = wallet + rt_amount;
                  firestor.doc(`users/${doc.data().userid}`).update({
                    wallet_balance: newWalleyAmount,
                  });
                })
                .catch((err) => console.log(err)); */

              firestor
                .doc(`users/${doc.data().userid}`)
                .collection("notification")
                .add({
                  date: new Date().toLocaleDateString(),
                  time: new Date().toLocaleTimeString(),
                  amount: rt_amount,
                  type: "investment",
                })
                .catch((err) => {
                  console.log(err);
                });

              firestor
                .doc(`investments/${doc.id}`)
                .delete()
                .catch((err) => console.log(err));
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          firestor
            .doc(`investments/${doc.id}`)
            .update({
              Checkduration: Checkduration + 1,
            })
            .catch((err) => {
              console.log(err);
            });
        }
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

router.route("/fakerator").get((req, res) => {
  const data = [
    {
      name: Fakerator("de-DE").names.name(),
      amount: Fakerator().random.number(400, 5000),
      type: "wallet deposit",
    },
    {
      name: Fakerator("en-CA").names.name(),
      amount: Fakerator().random.number(400, 5000),
      type: "wallet deposit",
    },
    {
      name: Fakerator("Hungarian").names.name(),
      amount: Fakerator().random.number(400, 5000),
      type: "wallet deposit",
    },
    {
      name: Fakerator("cs-CZ").names.name(),
      amount: Fakerator().random.number(400, 5000),
      type: "wallet deposit",
    },
    {
      name: Fakerator("ru-RU").names.name(),
      amount: Fakerator().random.number(400, 5000),
      type: "wallet deposit",
    },
    {
      name: Fakerator("de-DE").names.name(),
      amount: Fakerator().random.number(400, 5000),
      type: "Deposit withdrawal",
    },
    {
      name: Fakerator("fr-FR").names.name(),
      amount: Fakerator().random.number(400, 5000),
      type: "Deposit withdrawal",
    },
    {
      name: Fakerator("Hungarian").names.name(),
      amount: Fakerator().random.number(400, 5000),
      type: "Deposit withdrawal",
    },
    {
      name: Fakerator("it-IT").names.name(),
      amount: Fakerator().random.number(400, 5000),
      type: "Deposit withdrawal",
    },
    {
      name: Fakerator("ru-RU").names.name(),
      amount: Fakerator().random.number(400, 5000),
      type: "Deposit withdrawal",
    },
  ];

  firestor.doc("fakerator/12345").update({ data: data });

  res.send("ok done");
});

router.route("/test").get((req, res) => {
  firestor
    .doc(`users/0SsMSUPll3aSrd1XVMaKZ3fcjCC3`)
    .get()
    .then((data) => {
      console.log(data.data());
    });

  res.send("test");
});

module.exports = router;
