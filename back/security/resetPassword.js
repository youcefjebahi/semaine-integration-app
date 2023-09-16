const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Coordinateur = require("../models/coordinateur");
const transporter = require("../config/emailConfig");

const BlacklistedToken = require("../models/blacklistedToken");

router.post("/reset", async (req, res) => {
  const { email } = req.body;

  try {
    const coordinateur = await Coordinateur.findOne({ email });

    if (!coordinateur) {
      return res.status(404).json({ message: "Coordinateur non trouvé" });
    }

    const resetToken = jwt.sign({ email }, "key", {
      expiresIn: "1h",
    });
    const encodedToken = Buffer.from(resetToken).toString("base64");

    const mailOptions = {
      from: transporter.options.auth.user,
      to: email,
      subject: "Password Reset Request",
      html: `
          <p>Hello,</p>
          <p>Please click the link below to reset your password:</p>
          <a href="http://localhost:5173/resetPassword/${encodedToken}">Reset Password</a>
        `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ message: "Failed to send reset email" });
      } else {
        console.log("Reset email sent successfully:", info.response);
        res.json({ message: "Reset email sent successfully" });
      }
    });
  } catch (error) {
    console.error("Erreur lors de la réinitialisation du mot de passe:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

router.post("/reset/:token", async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const decodedToken = Buffer.from(token, "base64").toString("utf-8");

  try {
    jwt.verify(decodedToken, "key", async (error, decoded) => {
      if (error) {
        return res
          .status(400)
          .json({ message: "Token de réinitialisation invalide ou expiré" });
      }

      const isTokenBlacklisted = await BlacklistedToken.exists({
        token: decodedToken,
      });

      if (isTokenBlacklisted) {
        return res.status(401).json({ message: "Token invalide" });
      }
      const coordinateur = await Coordinateur.findOne({ email: decoded.email });

      if (!coordinateur) {
        return res.status(404).json({ message: "Coordinateur non trouvé" });
      }

      coordinateur.password = await bcrypt.hash(password, 10);
      await coordinateur.save();
      const expiresAt = Date.now() + 3600 * 1000;
      const blacklistedToken = new BlacklistedToken({
        token: decodedToken,
        expiresAt: new Date(expiresAt),
      });

      blacklistedToken.save();
      res.json({ message: "Mot de passe réinitialisé avec succès" });
    });
  } catch (error) {
    console.error("Erreur lors de la réinitialisation du mot de passe:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;
