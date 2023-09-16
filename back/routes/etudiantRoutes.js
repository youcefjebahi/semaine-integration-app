const express = require("express");
const router = express.Router();
const multer = require("multer");
const ExcelJS = require("exceljs");
const Etudiant = require("../models/etudiant");
const Date = require("../models/date");

const Authorisation = require("../security/authorisation");
const transporter = require("../config/emailConfig");

const storage = multer.memoryStorage();
const upload = multer({ storage });
const isInternational = (value) => value.toLowerCase() === "oui";

router.post(
  "/upload",
  Authorisation,
  upload.single("file"),
  async (req, res) => {
    let newStudentsCount = 0;

    try {
      const fileBuffer = req.file.buffer;

      const workbook = new ExcelJS.Workbook();

      await workbook.xlsx.load(fileBuffer);

      const worksheet = workbook.worksheets[0];

      for (let rowNumber = 2; rowNumber <= worksheet.rowCount; rowNumber++) {
        const row = worksheet.getRow(rowNumber);

        const etudiantData = {
          id: row.getCell(1).value,
          nom: row.getCell(2).value,
          prenom: row.getCell(3).value,
          email: row.getCell(6).value,
          emailEsprit: row.getCell(7).value,
          section: row.getCell(4).value,
          international: isInternational(row.getCell(5).value),
        };

        const existingEtudiant = await Etudiant.findOne({
          id: etudiantData.id,
        });
        if (existingEtudiant) {
          continue;
        }

        const etudiant = new Etudiant(etudiantData);
        if (etudiant.international === "oui") etudiant.international = true;
        if (etudiant.section) {
          const sectionLower = etudiant.section.toLowerCase();

          if (
            sectionLower.includes("électro") ||
            sectionLower.includes("electro") ||
            sectionLower.includes("eléctro") ||
            sectionLower.includes("éléctro") ||
            sectionLower.includes("em") ||
            sectionLower.includes("e-m") ||
            sectionLower.includes("e_m")
          ) {
            etudiant.section = "EM";
          } else if (
            sectionLower.includes("civil") ||
            sectionLower.includes("gc") ||
            sectionLower.includes("g-c") ||
            sectionLower.includes("g_c")
          ) {
            etudiant.section = "GC";
          } else if (
            sectionLower.includes("busines") ||
            sectionLower.includes("esb")
          ) {
            etudiant.section = "ESB";
          } else {
            etudiant.section = "INFO";
          }
        } else etudiant.section = "INFO";

        await etudiant.save();
        newStudentsCount++;
      }
      if (newStudentsCount == 0)
        res.json({ message: `pas des nouveaux étudiants à enregistrer` });
      else if (newStudentsCount == 1)
        res.json({
          message: `${newStudentsCount} étudiant a été enregistré avec succès`,
        });
      else
        res.json({
          message: `${newStudentsCount} étudiants ont été enregistrés avec succès!`,
        });
    } catch (error) {
      console.error("Erreur lors de l'enregistrement des étudiants:", error);
      res.status(500).json({
        message:
          "Une erreur est survenue lors de l'enregistrement des étudiants",
      });
    }
  }
);

router.get("/", Authorisation, async (req, res) => {
  try {
    const etudiants = await Etudiant.find().populate("equipe");

    res.json(etudiants);
  } catch (error) {
    console.error("Erreur lors de la récupération des étudiants:", error);
    res.status(500).json({
      message: "Une erreur est survenue lors de la récupération des étudiants",
    });
  }
});

router.get("/:id", Authorisation, async (req, res) => {
  const { id } = req.params;

  try {
    const etudiant = await Etudiant.findOne({ id: id }).populate("equipe");

    if (!etudiant) {
      return res.status(404).json({
        message: "Étudiant non trouvé",
      });
    }

    res.json(etudiant);
  } catch (error) {
    console.error("Erreur lors de la récupération de l'étudiant:", error);
    res.status(500).json({
      message: "Une erreur est survenue lors de la récupération de l'étudiant",
    });
  }
});
let permissionStudentInvite = true;
router.post("/inviter", Authorisation, async (req, res) => {
  if (permissionStudentInvite == true) {
    permissionStudentInvite = false;
    try {
      const nonInvitedStudents = await Etudiant.find({
        invited: false,
      }).populate({
        path: "equipe",
        populate: {
          path: "salles",
        },
      });
      const date = await Date.findOne();
      let s = 0;
      let e = 0;
      for (let i = 0; i < nonInvitedStudents.length; i++) {
        const student = nonInvitedStudents[i];
        const mailOptions = {
          from: transporter.options.auth.user,
          to: [student.email, student.emailEsprit],
          subject: "APP0",
          text:
            "Bonjour " +
            student.prenom +
            ", \nVous êtes invité à rejoindre la semaine d'intégration.\nDate: " +
            date.date +
            "\nEquipe: " +
            student.equipe.nom +
            "\nSalle jour 1: " +
            student.equipe.salles[0].numero +
            "\nSalle " +
            student.equipe.salles[1].numero +
            " pour le reste de la semaine",
        };

        try {
          await transporter.sendMail(mailOptions);

          student.invited = true;
          await student.save();
          s++;
          await req.io.emit("studentInvited", {
            index: i,
            invited: true,
            studentEmailSucces: s,
            studentEmailError: e,
            totalCount: nonInvitedStudents.length,
          });
        } catch (error) {
          console.error("Erreur lors de l'envoi d'un e-mail:", error);
          e++;
          await req.io.emit("studentInvited", {
            index: i,
            studentEmailSucces: s,
            studentEmailError: e,
            totalCount: nonInvitedStudents.length,
          });
        }
      }

      res.status(200).json({ message: "Invitations envoyées avec succès." });
    } catch (error) {
      console.error("Erreur lors de l'envoi des invitations:", error);
      res
        .status(500)
        .json({ message: "Erreur lors de l'envoi des invitations." });
    }
  }
  permissionStudentInvite = true;
});

module.exports = router;
