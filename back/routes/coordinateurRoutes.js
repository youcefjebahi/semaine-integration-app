const express = require("express");
const bcrypt = require("bcrypt");
const adminAccount = require("../security/adminAccount");

const router = express.Router();
const Coordinateur = require("../models/coordinateur");
const Authorisation = require("../security/authorisation");

router.get("/:email", Authorisation, (req, res) => {
  const { email } = req.params;

  Coordinateur.findOne({ email })
    .then((coordinateur) => {
      if (!coordinateur) {
        return res.sendStatus(404);
      }
      res.json(coordinateur);
    })
    .catch((error) => {
      console.error("Failed to fetch coordinateur:", error);
      res.sendStatus(500);
    });
});

router.put("/:email", Authorisation, async (req, res) => {
  const { email } = req.params;
  const { newEmail, nom, prenom, image } = req.body;

  if (req.coordinateurEmail === email) {
    try {
      const coordinateur = await Coordinateur.findOne({ email });

      if (!coordinateur) {
        return res.sendStatus(404);
      }

      if (image && image.data) {
        coordinateur.image = {
          data: image.data,
          contentType: image.contentType,
        };
      }

      coordinateur.email = newEmail;
      coordinateur.nom = nom;
      coordinateur.prenom = prenom;

      await coordinateur.save();

      console.log("Coordinateur updated successfully");
      res.sendStatus(200);
    } catch (error) {
      console.error("Failed to update Coordinateur:", error);
      res.sendStatus(500);
    }
  } else {
    res.sendStatus(403);
  }
});

router.delete("/:email", Authorisation, (req, res) => {
  const { email } = req.params;

  Coordinateur.findOneAndDelete({ email })
    .then((coordinateur) => {
      if (!coordinateur) {
        return res.sendStatus(404);
      }
      console.log("Coordinateur deleted successfully");
      adminAccount();

      res.sendStatus(200);
    })
    .catch((error) => {
      console.error("Failed to delete Coordinateur:", error);
      res.sendStatus(500);
    });
});

router.put("/:email/changePassword", Authorisation, async (req, res) => {
  const { email } = req.params;
  const { currentPassword, newPassword } = req.body;

  try {
    const coordinateur = await Coordinateur.findOne({ email });

    if (!coordinateur) {
      return res.status(404).json({ message: "Coordinateur non trouvé" });
    }

    // Vérifier si le mot de passe actuel correspond à celui stocké
    const isPasswordMatch = await bcrypt.compare(
      currentPassword,
      coordinateur.password
    );

    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Mot de passe incorrect" });
    }

    // Mettre à jour le mot de passe avec le nouveau mot de passe
    coordinateur.password = await bcrypt.hash(newPassword, 10);
    await coordinateur.save();

    res.json({ message: "Mot de passe modifié avec succès" });
  } catch (error) {
    console.error("Erreur lors de la modification du mot de passe:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

router.put("/:email/firstUpdate", Authorisation, async (req, res) => {
  const { email } = req.params;
  const { newEmail, nom, prenom, password, image } = req.body;

  if (req.coordinateurEmail === email) {
    try {
      const coordinateur = await Coordinateur.findOne({ email });

      if (!coordinateur) {
        return res.sendStatus(404);
      }

      if (image && image.data) {
        coordinateur.image = {
          data: image.data,
          contentType: image.contentType,
        };
      }

      coordinateur.email = newEmail;
      coordinateur.nom = nom;
      coordinateur.prenom = prenom;
      coordinateur.password = await bcrypt.hash(password, 10);

      await coordinateur.save();

      console.log("Coordinateur updated successfully");
      res.sendStatus(200);
    } catch (error) {
      console.error("Failed to update Coordinateur:", error);
      res.sendStatus(500);
    }
  } else {
    res.sendStatus(403);
  }
});

module.exports = router;
