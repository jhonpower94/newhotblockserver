const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
var firebase = require("firebase");

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

var array = [1, 2];

router.route("/").get((req, res) => {
  var task = cron.schedule(`*/30 * * * * *`, () => {
    var aTuringRef = firestor.collection("users").add({
      name: "Alan",
      middle: "Mathison",
      last: "Turing",
      born: 1912,
    });

    aTuringRef.then(() => {
      console.log("job done");
      stoptask();
    });
  });

  function stoptask() {
    task.destroy();
    console.log("destroyed task");
  }

  task.start();
  res.json({ success: true });
});

router.route("/cool").get((req, res) => {
  res.send(array);
});

router.route("/test").post((req, res) => {
  const { seconds, minute } = req.body;
  res.json({ seconds: seconds, minute: minute });
});

module.exports = router;
