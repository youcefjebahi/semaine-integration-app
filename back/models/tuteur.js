const mongoose = require("mongoose");

const tuteurSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  nom: {
    type: String,
  },
  prenom: {
    type: String,
  },
  departement: {
    type: String,
  },
  equipes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Equipe",
    },
  ],
});

const Tuteur = mongoose.model("Tuteur", tuteurSchema);

module.exports = Tuteur;
