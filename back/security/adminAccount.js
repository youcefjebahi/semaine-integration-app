const bcrypt = require("bcrypt");
const Coordinateur = require("../models/coordinateur");

const adminAccount = async () => {
  try {
    const existingCoordinateur = await Coordinateur.findOne();

    if (!existingCoordinateur) {
      const coordinateur = new Coordinateur({
        email: "admin",
        password: await bcrypt.hash("admin", 10),
      });

      await coordinateur.save();

      console.log('Compte coordinateur "admin" créé avec succès !');
    }
  } catch (error) {
    console.error("Erreur lors de la création du compte coordinateur :", error);
  }
};

module.exports = adminAccount;
