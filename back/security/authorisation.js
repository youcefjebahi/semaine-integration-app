const Coordinateur = require("../models/coordinateur");
const BlacklistedToken = require("../models/blacklistedToken");
const jwt = require("jsonwebtoken");

function authorisation(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Token manquant" });
  }

  jwt.verify(token, "key", async (error, decoded) => {
    if (error) {
      return res.status(401).json({ message: "Token invalide" });
    }

    req.coordinateurEmail = decoded.email;
    try {
      const coordinateur = await Coordinateur.findOne({ email: decoded.email });

      if (!coordinateur) {
        return res.status(403).json({ message: "Coordinateur non trouvé" });
      }

      const isTokenBlacklisted = await BlacklistedToken.exists({ token });

      if (isTokenBlacklisted) {
        return res.status(401).json({ message: "Token invalide" });
      }

      next();
    } catch (error) {
      console.error(
        "Erreur lors de la vérification de l'existence du coordinateur:",
        error
      );
      res.status(500).json({ message: "Erreur serveur" });
    }
  });
}

module.exports = authorisation;
