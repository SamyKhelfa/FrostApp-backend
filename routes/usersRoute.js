const express = require("express");
const router = express.Router();
const User = require("../models/Users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Route d'inscription
router.post("/signup", async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email déjà utilisé" });
    }

    const hashedPassword = await bcrypt.hash(password, 8);
    const newUser = new User({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });
    await newUser.save();

    const token = jwt.sign({ userId: newUser._id }, "your_jwt_secret"); // Utilisez un secret plus sûr

    res
      .status(201)
      .json({ _id: newUser._id, token, firstName, lastName, email });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route de connexion
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const newHash = SHA256(req.body.password + user.salt).toString(encBase64);
      if (newHash === user.hash) {
        res.status(200).json({
          _id: user._id,
          token: user.token,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          // ... autres champs nécessaires
        });
      } else {
        res.status(401).json({ message: "Mot de passe incorrect" });
      }
    } else {
      res.status(404).json({ message: "Utilisateur non trouvé" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Route pour récupérer tous les utilisateurs
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route pour récupérer un utilisateur par son ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ message: "Utilisateur non trouvé" });
    } else {
      res.json(user);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route pour supprimer un utilisateur
router.delete("/:id", async (req, res) => {
  try {
    const result = await User.findByIdAndDelete(req.params.id);
    if (!result) {
      res.status(404).json({ message: "Utilisateur non trouvé" });
    } else {
      res.json({ message: "Utilisateur supprimé" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route pour mettre à jour le profil d'un utilisateur
router.put("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Mise à jour des champs de l'utilisateur
    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.email = req.body.email || user.email;
    // ... autres champs à mettre à jour

    await user.save();
    res.json({ message: "Profil mis à jour", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route pour changer le mot de passe d'un utilisateur
router.put("/change-password/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Vérifier l'ancien mot de passe
    const oldHash = SHA256(req.body.oldPassword + user.salt).toString(
      encBase64
    );
    if (oldHash !== user.hash) {
      return res.status(401).json({ message: "Ancien mot de passe incorrect" });
    }

    // Mettre à jour avec le nouveau mot de passe
    user.salt = uid2(16);
    user.hash = SHA256(req.body.newPassword + user.salt).toString(encBase64);

    await user.save();
    res.json({ message: "Mot de passe changé avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route pour la récupération de mot de passe (email de réinitialisation)
// Note : Cette route devrait déclencher un processus d'envoi d'email
router.post("/recover-password", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ message: "Email non trouvé" });
    }

    // Générer un token de réinitialisation et envoyer un email
    // ... (implémentation de l'envoi d'email)

    res.json({ message: "Email de réinitialisation envoyé" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
