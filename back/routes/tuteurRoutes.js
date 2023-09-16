const express = require("express");
const router = express.Router();
const multer = require("multer");
const ExcelJS = require("exceljs");
const Tuteur = require("../models/tuteur");
const Authorisation = require("../security/authorisation");
const Equipe = require("../models/equipe");
const Salle = require("../models/salle");

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
      else if (worksheet.rowCount - 1 != Math.ceil(equipes.length / 4))
        res.json({
          message: `erreur: le nombre de tuteurs doit être ${Math.ceil(
            equipes.length / 4
          )}!`,
        });
      else {
        for (let rowNumber = 2; rowNumber <= worksheet.rowCount; rowNumber++) {
          const row = worksheet.getRow(rowNumber);

          const tutuerData = {
            email: row.getCell(1).value,
            nom: row.getCell(2).value,
            prenom: row.getCell(3).value,
            departement: row.getCell(4).value,
          };

          const tuteur = new Tuteur(tutuerData);

          await tuteur.save();
        }
        const salles = await Salle.find();

        const salles1 = [];
        const salles2 = [];
        salles.forEach((salle) => {
          if (salle.numero.startsWith("L")) {
            // il faut changer le caractère 'L' si le premier jour va être dans un autre block!
            salles1.push(salle);
          } else if (salle.numero.startsWith("A")) {
            // il faut changer le caractère 'A' si le reste de la semaine va être dans un autre block!
            salles2.push(salle);
          }
        });
        const tuteurAnglais = await Tuteur.find({ departement: "Anglais" });
        const equipesInternationaux = await Equipe.find({
          international: true,
        });
        let i = 0;
        let j = 0;
        let iSalleA = 0;

        while (i < equipesInternationaux.length) {
          let k = 1;
          while (k < 5 && i < equipesInternationaux.length) {
            equipesInternationaux[i].tuteur = tuteurAnglais[j];
            tuteurAnglais[j].equipes.push(equipesInternationaux[i]._id);
            equipesInternationaux[i].salles[0] = salles1[iSalleA];
            equipesInternationaux[i].salles[1] = salles2[iSalleA];

            await equipesInternationaux[i].save();
            i++;
            k++;
          }
          iSalleA++;
          await tuteurAnglais[j].save();
          j++;
        }
        const equipesNonInternationaux = await Equipe.find({
          international: false,
        });
        const tuteurs = await Tuteur.find().populate({
          path: "equipes",
          populate: {
            path: "salles",
          },
        });

        const tuteursWithoutEquipes = tuteurs.filter(
          (tuteur) => tuteur.equipes.length === 0
        );
        const tuteurEquipesNonComplete = tuteurs.filter(
          (tuteur) => tuteur.equipes.length < 4
        );

        let ii = 0;
        let jj = 0;
        let iSalleB = salles1.length - tuteursWithoutEquipes.length;
        while (ii < equipesNonInternationaux.length) {
          let k = tuteurEquipesNonComplete[jj].equipes.length;
          if (k > 0)
            while (k < 4) {
              equipesNonInternationaux[ii].tuteur =
                tuteurEquipesNonComplete[jj];
              tuteurEquipesNonComplete[jj].equipes.push(
                equipesNonInternationaux[ii]._id
              );

              equipesNonInternationaux[ii].salles[0] =
                tuteurEquipesNonComplete[jj].equipes[0].salles[0];
              equipesNonInternationaux[ii].salles[1] =
                tuteurEquipesNonComplete[jj].equipes[0].salles[1];

              await equipesNonInternationaux[ii].save();
              ii++;
              k++;
            }
          else {
            while (k < 4) {
              equipesNonInternationaux[ii].tuteur =
                tuteurEquipesNonComplete[jj];
              tuteurEquipesNonComplete[jj].equipes.push(
                equipesNonInternationaux[ii]._id
              );
              equipesNonInternationaux[ii].salles[0] = salles1[iSalleB];
              equipesNonInternationaux[ii].salles[1] = salles2[iSalleB];
              await equipesNonInternationaux[ii].save();
              ii++;
              k++;
            }
            iSalleB++;
          }
          await tuteurEquipesNonComplete[jj].save();

          jj++;
        }

        res.json({
          message: `${
            worksheet.rowCount - 1
          } tuteurs ont été enregistrés avec succès!`,
        });
      }
    } catch (error) {
      console.error("Erreur lors de l'enregistrement des tuteurs:", error);
      res.status(500).json({
        message: "Une erreur est survenue lors de l'enregistrement des tuteurs",
      });
    }
  }
);

router.get("/", Authorisation, async (req, res) => {
  try {
    const tuteurs = await Tuteur.find().populate("equipes");

    res.json(tuteurs);
  } catch (error) {
    console.error("Erreur lors de la récupération des tuteurs:", error);
    res.status(500).json({
      message: "Une erreur est survenue lors de la récupération des tuteurs",
    });
  }
});

router.get("/:email", Authorisation, async (req, res) => {
  const { email } = req.params;

  try {
    const tuteur = await Tuteur.findOne({ email: email }).populate("equipes");

    res.json(tuteur);
  } catch (error) {
    console.error("Erreur lors de la récupération de tuteur:", error);
    res.status(500).json({
      message: "Une erreur est survenue lors de la récupération des tuteur",
    });
  }
});

module.exports = router;
