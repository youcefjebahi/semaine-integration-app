const express = require("express");
const router = express.Router();
const multer = require("multer");
const ExcelJS = require("exceljs");
const Salle = require("../models/salle");
const Authorisation = require("../security/authorisation");
const Equipe = require("../models/equipe");

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post(
  "/upload",
  Authorisation,
  upload.single("file"),
  async (req, res) => {
    try {
      const equipes = await Equipe.find();

      const fileBuffer = req.file.buffer;

      const workbook = new ExcelJS.Workbook();

      await workbook.xlsx.load(fileBuffer);

      const worksheet = workbook.worksheets[0];
      if (equipes.length == 0)
        res.json({
          message: `erreur: saisissez d'abord le nombre d'équipes!`,
        });
      else if (worksheet.rowCount - 1 != Math.ceil(equipes.length / 4) * 2)
        res.json({
          message: `erreur: le nombre de salles doit être ${
            Math.ceil(equipes.length / 4) * 2
          }!`,
        });
      else {
        for (let rowNumber = 2; rowNumber <= worksheet.rowCount; rowNumber++) {
          const row = worksheet.getRow(rowNumber);

          const salleData = {
            numero: row.getCell(1).value,
          };

          const salle = new Salle(salleData);

          await salle.save();
        }

        res.json({
          message: `${
            worksheet.rowCount - 1
          } salles ont été enregistrés avec succès!`,
        });
      }
    } catch (error) {
      console.error("Erreur lors de l'enregistrement des salles:", error);
      res.status(500).json({
        message: "Une erreur est survenue lors de l'enregistrement des salles",
      });
    }
  }
);

router.get("/", Authorisation, async (req, res) => {
  try {
    const salles = await Salle.find();

    res.json(salles);
  } catch (error) {
    console.error("Erreur lors de la récupération des salles:", error);
    res.status(500).json({
      message: "Une erreur est survenue lors de la récupération des salles",
    });
  }
});

router.get("/:numero", Authorisation, async (req, res) => {
  const { numero } = req.params;

  try {
    const salle = await Salle.findOne({ numero: numero });
    if (!salle) {
      return res.status(404).json({ message: "Salle non trouvée" });
    }
    res.json(salle);
  } catch (error) {
    console.error("Erreur lors de la récupération de la salle:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});
module.exports = router;
