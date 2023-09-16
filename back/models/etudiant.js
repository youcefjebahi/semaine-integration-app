const mongoose = require("mongoose");

const SectionEnum = {
  INFORMATIQUE: "INFO",
  ELECTROMECANIQUE: "EM",
  GENIE_CIVIL: "GC",
  BUSINESS: "ESB",
};

const etudiantSchema = new mongoose.Schema({
  id: {
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
  email: {
    type: String,
  },
  emailEsprit: {
    type: String,
  },
  section: {
    type: String,
    enum: Object.values(SectionEnum),
  },
  international: {
    type: Boolean,
    required: true,
  },
  invited: {
    type: Boolean,
    default: false,
  },
  equipe: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Equipe",
  },
});

const Etudiant = mongoose.model("Etudiant", etudiantSchema);

module.exports = Etudiant;
