const express = require("express");
const router = express.Router();
const multer = require("multer");
const ExcelJS = require("exceljs");
const Tuteur = require("../models/tuteur");
const Authorisation = require("../security/authorisation");
const MembreComite = require("../models/membreComite");

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post(
  "/upload",
  Authorisation,
  upload.single("file"),
  async (req, res) => {
    try {
      const tuteurs = await Tuteur.find();

      const fileBuffer = req.file.buffer;

      const workbook = new ExcelJS.Workbook();

      await workbook.xlsx.load(fileBuffer);

      const worksheet = workbook.worksheets[0];
      if (tuteurs.length == 0)
        res.json({
          message: `erreur: importer tout d'abord le fichier de tuteurs!`,
        });
      else if (worksheet.rowCount - 1 != Math.ceil(tuteurs.length / 5))
        res.json({
          message: `erreur: le nombre de membreComités doit être égale à ${Math.ceil(
            tuteurs.length / 5
          )}!`,
        });
      else {
        for (let rowNumber = 2; rowNumber <= worksheet.rowCount; rowNumber++) {
          const row = worksheet.getRow(rowNumber);

          const membreComiteData = {
            email: row.getCell(1).value,
            nom: row.getCell(2).value,
            prenom: row.getCell(3).value,
          };

          const membreComite = new MembreComite(membreComiteData);

          await membreComite.save();
        }

        const membresComite = await MembreComite.find();

        let i = 0;
        let j = 0;

        while (i < tuteurs.length && j < membresComite.length) {
          let k = 1;
          while (k < 6 && i < tuteurs.length) {
            membresComite[j].tuteurs.push(tuteurs[i]._id);
            i++;
            k++;
          }
          await membresComite[j].save();
          j++;
        }

        res.json({
          message: `${
            worksheet.rowCount - 1
          } membreComités ont été enregistrés avec succès!`,
        });
      }
    } catch (error) {
      console.error(
        "Erreur lors de l'enregistrement des membreComités:",
        error
      );
      res.status(500).json({
        message:
          "Une erreur est survenue lors de l'enregistrement des membreComités",
      });
    }
  }
);

router.get("/", Authorisation, async (req, res) => {
  try {
    const membreComite = await MembreComite.find().populate("tuteurs");

    res.json(membreComite);
  } catch (error) {
    console.error("Erreur lors de la récupération des membreComités:", error);
    res.status(500).json({
      message:
        "Une erreur est survenue lors de la récupération des membreComités",
    });
  }
});

router.get("/:email", Authorisation, async (req, res) => {
  const { email } = req.params;

  try {
    const membre = await MembreComite.findOne({ email: email }).populate(
      "tuteurs"
    );

    res.json(membre);
  } catch (error) {
    console.error("Erreur lors de la récupération de membre:", error);
    res.status(500).json({
      message: "Une erreur est survenue lors de la récupération de membre",
    });
  }
});
module.exports = router;
