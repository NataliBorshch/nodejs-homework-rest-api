const sgMail = require("@sendgrid/mail");
require("dotenv").config();

class CreateSenderSendGrid {
  async Send(msg) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    return await sgMail.send({
      ...msg,
      from: "Borshch alexborshchnatali@gmail.com",
    });
  }
}

module.exports = CreateSenderSendGrid;
