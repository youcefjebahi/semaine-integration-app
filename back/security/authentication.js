const express = require("express");

const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Coordinateur = require("../models/coordinateur");
const BlacklistedToken = require("../models/blacklistedToken");

function generateToken(coordinateur) {
  const token = jwt.sign({ email: coordinateur.email }, "key", {
    expiresIn: "24h",
  });

  return token;
}

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const coordinateur = await Coordinateur.findOne({ email });

    if (!coordinateur) {
      return res
        .status(401)
        .json({ message: "Email ou mot de passe invalide" });
    }

    const passwordMatch = await bcrypt.compare(password, coordinateur.password);

    if (!passwordMatch) {
      return res
        .status(401)
        .json({ message: "Email ou mot de passe invalide" });
    }

    const token = generateToken(coordinateur);
    res.json({ token });
  } catch (error) {
    console.error("Erreur lors de la tentative de login:", error);
    res.status(500).json({
      message: "Une erreur est survenue lors de la tentative de login",
    });
  }
});
router.post("/logout", (req, res) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Token manquant" });
  }

  const expiresAt = Date.now() + 86400 * 1000;
  const blacklistedToken = new BlacklistedToken({
    token: token,
    expiresAt: new Date(expiresAt),
  });

  blacklistedToken
    .save()
    .then(() => {
      res.json({ message: "Déconnexion réussie" });
    })
    .catch((error) => {
      console.error("Erreur lors de la déconnexion :", error);
      res.status(500).json({ message: "Erreur serveur" });
    });
});

module.exports = router;
