
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "email", // adresse email de l'expéditeur
    pass: "password", // mot de passe
  },
});

module.exports = transporter;
