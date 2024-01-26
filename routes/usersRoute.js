const express = require("express");
const router = express.Router();
const User = require("../models/Users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Le dossier où les fichiers seront stockés
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

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
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Si vous utilisez bcrypt pour les mots de passe
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Mot de passe incorrect" });
    }

    // Si vous utilisez SHA256 et salt
    // const newHash = SHA256(req.body.password + user.salt).toString(encBase64);
    // if (newHash !== user.hash) {
    //   return res.status(401).json({ message: "Mot de passe incorrect" });
    // }

    const token = jwt.sign({ userId: user._id }, "your_jwt_secret");
    res.status(200).json({
      _id: user._id,
      token,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      // ... autres champs nécessaires
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
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

router.post(
  "/profile/:id/upload-photo",
  upload.single("photo"),
  async (req, res) => {
    try {
      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(404).send("Utilisateur non trouvé");
      }

      user.photo = req.file.path; // Enregistrez le chemin du fichier dans l'attribut photo de l'utilisateur
      await user.save();

      res
        .status(200)
        .json({
          message: "Photo téléchargée avec succès",
          photoPath: req.file.path,
        });
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);

module.exports = router;
