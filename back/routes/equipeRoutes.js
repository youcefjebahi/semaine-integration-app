const express = require("express");
const router = express.Router();
const Equipe = require("../models/equipe");
const Salle = require("../models/salle");
const Date = require("../models/date");

const Etudiant = require("../models/etudiant");
const Coordinateur = require("../models/coordinateur");

const Authorisation = require("../security/authorisation");
const Tuteur = require("../models/tuteur");
const MembreComite = require("../models/membreComite");

router.post("/createTeams", Authorisation, async (req, res) => {
  const { numberOfTeams } = req.body;
  const coordinateur = await Coordinateur.findOne({
    email: req.coordinateurEmail,
  });

  if (!coordinateur) {
    return res.status(404).json({ message: "Coordinateur non trouvé" });
  }
  try {
    if (typeof numberOfTeams !== "number" || numberOfTeams <= 0) {
      return res.status(400).json({ message: "Nombre d'équipes invalide" });
    }

    const teams = [];
    for (let i = 1; i <= numberOfTeams; i++) {
      const equipe = new Equipe({
        nom: `Equipe${i}`,
        international: i <= numberOfTeams / 8,
        coordinateur: coordinateur._id,
      });
      teams.push(equipe);
    }

    await Equipe.insertMany(teams);

    res.json({ message: `${numberOfTeams} équipes créées avec succès` });
  } catch (error) {
    console.error("Erreur lors de la création des équipes:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

router.get("/", Authorisation, async (req, res) => {
  try {
    const equipes = await Equipe.find()
      .populate("tuteur")
      .populate("salles")
      .populate("etudiants");
    res.json(equipes);
  } catch (error) {
    console.error("Erreur lors de la récupération des équipes:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

router.get("/:nom", Authorisation, async (req, res) => {
  const { nom } = req.params;

  try {
    const equipe = await Equipe.findOne({ nom: nom })
      .populate("tuteur")
      .populate("salles")
      .populate("etudiants");
    if (!equipe) {
      return res.status(404).json({ message: "Équipe non trouvée" });
    }
    res.json(equipe);
  } catch (error) {
    console.error("Erreur lors de la récupération de l'équipe:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

router.delete("/deleteAll", Authorisation, async (req, res) => {
  try {
    await Equipe.deleteMany({});
    await Etudiant.deleteMany({});
    await Salle.deleteMany({});
    await Tuteur.deleteMany({});
    await MembreComite.deleteMany({});
    await Date.deleteMany({});

    res.json({ message: "Tous les équipes ont été supprimés" });
  } catch (error) {
    console.error(
      "Erreur lors de la suppression des équipes et étudiants:",
      error
    );
    res.status(500).json({ message: "Erreur serveur" });
  }
});

router.post("/repartitionEtudiants", Authorisation, async (req, res) => {
  let newStudentsCount = 0;
  const equipes = await Equipe.find();
  if (equipes.length == 0)
    res.json({
      message: `erreur: saisissez d'abord le nombre d'équipes!`,
    });
  else
    try {
      const etudiantsInternationaux = await Etudiant.find({
        international: true,
      });

      const etudiantsInformatique = await Etudiant.find({
        international: false,
        section: "INFO",
      });
      
      const etudiantsElectromécanique = await Etudiant.find({
        international: false,
        section: "EM",
      });
      const etudiantsGénieCivil = await Etudiant.find({
        international: false,
        section: "GC",
      });
      const etudiantsEsb = await Etudiant.find({
        international: false,
        section: "ESB",
      });

    

      const equipesInternationaux = await Equipe.find({ international: true });
      let equipesNonInternationaux = await Equipe.find({
        international: false,
      });

      equipesNonInternationaux = equipesNonInternationaux.sort(
        (a, b) => a.etudiants.length - b.etudiants.length
      );

      let equipeIndexInternational = 0;
      for (const etudiant of etudiantsInternationaux) {
        if (!etudiant.equipe) {
          equipeIndexInternational =
            equipeIndexInternational % equipesInternationaux.length;
          const equipe = equipesInternationaux[equipeIndexInternational];
          etudiant.equipe = equipe._id;
          equipe.etudiants.push(etudiant._id);
          await Promise.all([etudiant.save(), equipe.save()]);
          equipeIndexInternational++;
          newStudentsCount++;
        }
      }

      let equipeIndexNonInternational = 0;
      for (const etudiant of etudiantsInformatique) {
        if (!etudiant.equipe) {
          equipeIndexNonInternational =
            equipeIndexNonInternational % equipesNonInternationaux.length;
          const equipe = equipesNonInternationaux[equipeIndexNonInternational];
          etudiant.equipe = equipe._id;
          equipe.etudiants.push(etudiant._id);
          await Promise.all([etudiant.save(), equipe.save()]);
          equipeIndexNonInternational++;
          newStudentsCount++;
        }
      }
      for (const etudiant of etudiantsEsb) {
        if (!etudiant.equipe) {
          equipeIndexNonInternational =
            equipeIndexNonInternational % equipesNonInternationaux.length;
          const equipe = equipesNonInternationaux[equipeIndexNonInternational];
          etudiant.equipe = equipe._id;
          equipe.etudiants.push(etudiant._id);
          await Promise.all([etudiant.save(), equipe.save()]);
          equipeIndexNonInternational++;
          newStudentsCount++;
        }
      }
      for (const etudiant of etudiantsElectromécanique) {
        if (!etudiant.equipe) {
          equipeIndexNonInternational =
            equipeIndexNonInternational % equipesNonInternationaux.length;
          const equipe = equipesNonInternationaux[equipeIndexNonInternational];
          etudiant.equipe = equipe._id;
          equipe.etudiants.push(etudiant._id);
          await Promise.all([etudiant.save(), equipe.save()]);
          equipeIndexNonInternational++;
          newStudentsCount++;
        }
      }
      for (const etudiant of etudiantsGénieCivil) {
        if (!etudiant.equipe) {
          equipeIndexNonInternational =
            equipeIndexNonInternational % equipesNonInternationaux.length;
          const equipe = equipesNonInternationaux[equipeIndexNonInternational];
          etudiant.equipe = equipe._id;
          equipe.etudiants.push(etudiant._id);
          await Promise.all([etudiant.save(), equipe.save()]);
          equipeIndexNonInternational++;
          newStudentsCount++;
        }
      }
      
      
      if (newStudentsCount == 0)
        res.json({ message: `pas des nouveaux étudiants à répartir` });
      else if (newStudentsCount == 1)
        res.json({ message: `${newStudentsCount} étudiant a été réparti!` });
      else
        res.json({
          message: `${newStudentsCount} étudiants ont été répartis!`,
        });
    } catch (error) {
      console.error("Erreur lors de la répartition des étudiants:", error);
      res.status(500).json({
        message: "Une erreur est survenue lors de la répartition des étudiants",
      });
    }
});

module.exports = router;
