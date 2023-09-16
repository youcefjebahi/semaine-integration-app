const mongoose = require("mongoose");

const coordinateurSchema = new mongoose.Schema({
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
  password: {
    type: String,
    required: true,
  },
  image: {
    data: {
      type: String,
    },
    contentType: {
      type: String,
    },
  },
});

const Coordinateur = mongoose.model("Coordinateur", coordinateurSchema);

module.exports = Coordinateur;
