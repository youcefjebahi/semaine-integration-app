const mongoose = require("mongoose");

const membreComiteSchema = new mongoose.Schema({
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
  tuteurs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tuteur",
    },
  ],
});

const MembreComite = mongoose.model("MembreComite", membreComiteSchema);

module.exports = MembreComite;
