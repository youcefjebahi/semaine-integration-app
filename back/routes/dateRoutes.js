const express = require("express");
const router = express.Router();
const DateModel = require("../models/date");
const Equipe = require("../models/equipe");
const Authorisation = require("../security/authorisation");


router.post("/create", Authorisation, async (req, res) => {
  try {
    const equipes = await Equipe.find();

    const { date } = req.body;

    const newDate = new DateModel({ date });
    if (equipes.length == 0)
      res.json({
        message: `erreur: saisissez d'abord le nombre d'équipes!`,
      });
    else {
      await newDate.save();

      res
        .status(201)
        .json({ message: "Date created successfully", date: newDate });
    }
  } catch (error) {
    console.error("Error creating date:", error);
    res.status(500).json({ message: "Error creating date" });
  }
});
router.get("/", Authorisation, async (req, res) => {
  try {
    const dates = await DateModel.find();
    res.status(200).json(dates);
  } catch (error) {
    console.error("Error fetching dates:", error);
    res.status(500).json({ message: "Error fetching dates" });
  }
});

module.exports = router;
