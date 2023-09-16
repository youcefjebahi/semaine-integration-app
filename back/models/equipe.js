const mongoose = require("mongoose");

const equipeSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
    unique: true,
  },
  international: {
    type: Boolean,
    required: true,
  },
  coordinateur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Coordinateur",
  },
  etudiants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Etudiant",
    },
  ],
  salles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Salle",
    },
  ],
  tuteur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tuteur",
  },
});

const Equipe = mongoose.model("Equipe", equipeSchema);

module.exports = Equipe;
