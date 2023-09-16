const mongoose = require("mongoose");

const salleSchema = new mongoose.Schema({
  numero: {
    type: String,
    required: true,
    unique: true,
  },
});

const Salle = mongoose.model("Salle", salleSchema);

module.exports = Salle;
