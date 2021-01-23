const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
var cors = require("cors");
router.use(cors());
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.route("/").post((req, res) => {
  const { message, to, subject } = req.body;
  // async..await is not allowed in global scope, must use a wrapper
  async function main() {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "mail.relianceexchange.co",
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: "service@relianceexchange.co", // generated ethereal user
        pass: "reliance2020", // generated ethereal password
      },
    });

    const sitename = "relianceexchange";
    const imagelogo =
      "https://firebasestorage.googleapis.com/v0/b/hotblockinvest.appspot.com/o/logos%2Flogo.png?alt=media&token=75b4dced-054b-4959-8ab2-4f82ba5b9f8f";

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"relianceexchange" <service@relianceexchange.co>', // sender address
      to: to, // list of receivers
      subject: `${subject} / ${sitename} ✔`, // Subject line
      // text: "Hello world?", // plain text body
      html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"><html> <head> <meta charset="utf-8" /> <style> .ExternalClass { width: 100%; } /* Forces Outlook.com to display emails at full width */ .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div { line-height: 100%; } /* Forces Outlook.com to display normal line spacing, here is more on that: http://www.emailonacid.com/forum/viewthread/43/ */ .imageFix { display: block; } a { text-decoration: none; } @media screen and (max-width: 600px) { table.row th.col-lg-1, table.row th.col-lg-2, table.row th.col-lg-3, table.row th.col-lg-4, table.row th.col-lg-5, table.row th.col-lg-6, table.row th.col-lg-7, table.row th.col-lg-8, table.row th.col-lg-9, table.row th.col-lg-10, table.row th.col-lg-11, table.row th.col-lg-12 { display: block; width: 100% !important; } .d-mobile { display: block !important; } .d-desktop { display: none !important; } } @media yahoo { .d-mobile { display: none !important; } .d-desktop { display: block !important; } } </style> </head> <body style=" -moz-box-sizing: border-box; -ms-text-size-adjust: 100%; -webkit-box-sizing: border-box; -webkit-text-size-adjust: 100%; margin: 0; border: 0; box-sizing: border-box; font-family: Helvetica, Arial, sans-serif; font-size: 16px; font-weight: normal; height: 100%; line-height: 24px; margin: 0; min-width: 100%; outline: 0; padding: 0; width: 100%; " > <div class="bg-light" style="background-color: #f8f9fa"> <table class="container" style=" border-collapse: collapse; border-spacing: 0px; font-family: Helvetica, Arial, sans-serif; " border="0" cellpadding="0" cellspacing="0" width="100%" > <tbody> <tr> <td align="center" style=" border-collapse: collapse; border-spacing: 0px; font-size: 16px; line-height: 24px; margin: 0; padding: 0px 16px 0 16px; " > <!--[if (gte mso 9)|(IE)]> <table align="center"> <tbody> <tr> <td width="600"> <![endif]--> <table align="center" style=" border-collapse: collapse; border-spacing: 0px; font-family: Helvetica, Arial, sans-serif; max-width: 600px; " border="0" cellpadding="0" cellspacing="0" width="100%" > <tbody> <tr> <td style=" border-collapse: collapse; border-spacing: 0px; font-size: 16px; line-height: 24px; margin: 0; " > <table align="center" style=" border-collapse: collapse; border-spacing: 0px; font-family: Helvetica, Arial, sans-serif; " border="0" cellpadding="0" cellspacing="0" > <tbody> <tr> <td align="center" style=" border-collapse: collapse; border-spacing: 0px; font-size: 16px; line-height: 24px; margin: 0; " > <div class="mt-4 mb-3" style="margin-bottom: 16px; margin-top: 24px" ></div> </td> </tr> </tbody> </table> <div class="mb-4" style="margin-bottom: 24px"> <table class="card mb-4" style=" border: 1px solid #dee2e6; border-collapse: separate !important; border-radius: 4px; border-spacing: 0px; font-family: Helvetica, Arial, sans-serif; overflow: hidden; " border="0" cellpadding="0" cellspacing="0" bgcolor="#ffffff" width="100%" > <tbody> <tr> <td style=" border-collapse: collapse; border-spacing: 0px; font-size: 16px; line-height: 24px; margin: 0; " width="100%" > <div style=" background: white; border-top: 5px solid #ff5722; " > <table class="card-body" style=" border-collapse: collapse; border-spacing: 0px; font-family: Helvetica, Arial, sans-serif; " border="0" cellpadding="0" cellspacing="0" width="100%" > <tbody> <tr> <td style=" border-collapse: collapse; border-spacing: 0px; font-size: 16px; line-height: 24px; margin: 0; padding: 20px; " width="100%" > <div> <h4 class="text-center" style=" color: inherit; font-size: 24px; font-weight: 500; line-height: 26.4px; margin-bottom: 8px; margin-top: 0; text-align: center; vertical-align: baseline; " ></h4> <img src=${imagelogo} alt="emailogo.png" style="height: 60px" /> <h5 class="text-muted text-center" style=" padding-top: 20px; color: #636c72; font-size: 20px; font-weight: 500; line-height: 22px; margin-bottom: 8px; margin-top: 0; vertical-align: baseline; " > ${message} </h5> <table class="hr" style=" border: 0; border-collapse: collapse; border-spacing: 0px; font-family: Helvetica, Arial, sans-serif; " border="0" cellpadding="0" cellspacing="0" width="100%" > <tbody> <tr> <td style=" border-collapse: collapse; border-spacing: 0px; font-size: 16px; line-height: 24px; margin: 0; padding: 16px 0px; " width="100%" > <h5 class="text-muted text-center" style=" color: #636c72; font-size: 12px; font-weight: 500; line-height: 22px; margin-bottom: 8px; margin-top: 0; vertical-align: baseline; " > &copy; ${new Date().getFullYear()} ${sitename} </h5> </td> </tr> </tbody> </table> </div> </td> </tr> </tbody> </table> </div> </td> </tr> </tbody> </table> </div> </td> </tr> </tbody> </table> <!--[if (gte mso 9)|(IE)]> </td> </tr> </tbody> </table> <![endif]--> </td> </tr> </tbody> </table> </div> </body></html>`,
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  }

  main().catch(console.error);

  res.send("working");
});

router.route("/test").post((req, res) => {
  res.send("working");
});

module.exports = router;
