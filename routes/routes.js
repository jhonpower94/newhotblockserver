const express = require("express");
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
  apiKey: "AIzaSyAvue4Nuo9hVT9ex5TGGsx0EB-fDxkATbQ",
  authDomain: "hotblock-48cbf.firebaseapp.com",
  databaseURL: "https://hotblock-48cbf.firebaseio.com",
  projectId: "hotblock-48cbf",
  storageBucket: "hotblock-48cbf.appspot.com",
  messagingSenderId: "569044229872",
  appId: "1:569044229872:web:bf02b30a0da2239f286c35",
  measurementId: "G-1PJ3688ZV0",
};
const app = firebase.initializeApp(firebaseConfig);
const firestor = app.firestore(app);

var CronJob = require("cron").CronJob;
var CronJobManager = require("cron-job-manager");

const manager = new CronJobManager();

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
  var job = new manager.add("key", "*/5 * * * * *", function () {
    console.log("You will see this message once");
    stopTask();
  });

  function stopTask() {
    job.stop();
  }
  job.start();
  res.send("block info started");
});

router.route("/blocks").get((req, res) => {
  res.send("blocks");
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

  console.log(req.body);
  const key = random(10);

  manager.add(key, `* */${duration} * * * *`, function () {
    firestor
      .doc(`users/${userid}`)
      .collection("deposits")
      .doc(depositid)
      .update({
        complete: true,
        return_amount: rt_amount,
      })
      .then(() => {
        firestor
          .doc(`users/${userid}`)
          .collection("notification")
          .add({
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString(),
            amount: rt_amount,
            type: "investment",
          })
          .then(() => {
            console.log("fininished task");
          })
          .catch((errorr) => console.log(errorr));
      })
      .catch((err) => console.log(err));
    stopTask();
  });

  function stopTask() {
    manager.stop(key);
  }

  manager.start(key);
  /*  firestor
    .doc(`users/${userid}`)
    .collection("deposits")
    .doc(depositid)
    .update({
      complete: true,
      return_amount: rt_amount,
    })
    .then(() => {
      firestor.doc(`users/${userid}`).collection("notification").add({
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        amount: rt_amount,
        type: "investment",
      });
    }); */

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
