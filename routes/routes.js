const express = require("express");
const docData = require("rxfire/firestore");
const router = express.Router();
const bodyParser = require("body-parser");
var random = require("random-key-generator");
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
  appId: "1:554107235093:web:ddb295c6cffdcc2ae4571c",
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
    const oldData = doc.data().commodities;
    const oldDataCurrency = doc.data().currencies;
    const oldDataRealestate = doc.data().realestate;
    const oldDataStock = doc.data().stock;

    const sliceData = oldData.slice(0, 8);
    const sliceDataCurrency = oldDataCurrency.slice(0, 8);
    const sliceDataRealestate = oldDataRealestate.slice(0, 8);
    const sliceDataStock = oldDataStock.slice(0, 8);

    sliceData.splice(0, 0, {
      value: Math.floor(Math.random() * (30 - 5)) + 5,
      trade: "commodities",
      time: getHour,
    });
    sliceDataCurrency.splice(0, 0, {
      value: Math.floor(Math.random() * (95 - 75)) + 75,
      trade: "currency",
      time: getHour,
    });
    sliceDataRealestate.splice(0, 0, {
      value: Math.floor(Math.random() * (54 - 28)) + 28,
      trade: "realestate",
      time: getHour,
    });
    sliceDataStock.splice(0, 0, {
      value: Math.floor(Math.random() * (70 - 55)) + 55,
      trade: "stock",
      time: getHour,
    });

    firestor
      .doc(`plans/${12345}`)
      .update({
        currencies: sliceDataCurrency,
        stock: sliceDataStock,
        realestate: sliceDataRealestate,
        commodities: sliceData,
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
      currencies: [
        { trade: "currency", time: "1", value: 75 },
        { trade: "currency", time: "2", value: 80 },
        { trade: "currency", time: "3", value: 77 },
        { trade: "currency", time: "4", value: 91 },
        { trade: "currency", time: "5", value: 88 },
        { trade: "currency", time: "6", value: 80 },
        { trade: "currency", time: "7", value: 75 },
        { trade: "currency", time: "8", value: 95 },
        { trade: "currency", time: "9", value: 85 },
      ],
      stock: [
        { trade: "stock", time: "1", value: 55 },
        { trade: "stock", time: "2", value: 60 },
        { trade: "stock", time: "3", value: 64 },
        { trade: "stock", time: "4", value: 70 },
        { trade: "stock", time: "5", value: 69 },
        { trade: "stock", time: "6", value: 55 },
        { trade: "stock", time: "7", value: 60 },
        { trade: "stock", time: "8", value: 58 },
        { trade: "stock", time: "9", value: 60 },
      ],
      realestate: [
        { trade: "realestate", time: "1", value: 30 },
        { trade: "realestate", time: "2", value: 49 },
        { trade: "realestate", time: "3", value: 54 },
        { trade: "realestate", time: "4", value: 50 },
        { trade: "realestate", time: "5", value: 40 },
        { trade: "realestate", time: "6", value: 39 },
        { trade: "realestate", time: "7", value: 35 },
        { trade: "realestate", time: "8", value: 48 },
        { trade: "realestate", time: "9", value: 38 },
      ],
      commodities: [
        { trade: "commodities", time: "1", value: 20 },
        { trade: "commodities", time: "2", value: 25 },
        { trade: "commodities", time: "3", value: 22 },
        { trade: "commodities", time: "4", value: 31 },
        { trade: "commodities", time: "5", value: 34 },
        { trade: "commodities", time: "6", value: 20 },
        { trade: "commodities", time: "7", value: 25 },
        { trade: "commodities", time: "8", value: 28 },
        { trade: "commodities", time: "9", value: 19 },
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
              firestor
                .doc(`users/${doc.data().userid}`)
                .get()
                .then((data) => {
                  const wallet = data.data().wallet_balance;
                  const newWalleyAmount = wallet + rt_amount;
                  firestor.doc(`users/${doc.data().userid}`).update({
                    wallet_balance: newWalleyAmount,
                  });
                })
                .catch((err) => console.log(err));

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
