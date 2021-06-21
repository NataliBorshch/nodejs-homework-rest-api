const Mailgen = require("mailgen");
require("dotenv").config();

class EmailService {
  constructor(env, sender) {
    console.log(sender);
    this.sender = sender;
    switch (env) {
      case "development":
        this.link = "http://localhost:3000";
        break;

      case "production":
        this.link = "link fro production";
        break;
      default:
        this.link = "http://localhost:3000";
        break;
    }
  }

  #createTemplateEmail(verifyToken, name) {
    const mailGenerator = new Mailgen({
      theme: "salted",
      product: {
        name: "Borshch",
        link: this.link,
      },
    });

    const email = {
      body: {
        name,
        intro: "Welcome to Borshch! We're very excited to have you on board.",
        action: {
          instructions: "To get started with Borshch, please click here:",
          button: {
            color: "#22BC66", // Optional action button color
            text: "Confirm your account",
            link: `${this.link}/api/user/verify/${verifyToken}`,
          },
        },
      },
    };

    return mailGenerator.generate(email);
  }

  async sendEmailVerify(verifyToken, email, name) {
    const emailHTML = this.#createTemplateEmail(verifyToken, name);
    const msg = {
      to: email,
      subject: "Verify your account ",
      html: emailHTML,
    };
    const result = await this.sender.send(msg);
    console.log(result);
  }
}

module.exports = EmailService;
