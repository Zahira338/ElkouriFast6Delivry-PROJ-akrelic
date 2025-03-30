const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Route pour l'inscription
// POST /auth/register
router.post('/register', async (req, res) => {
  const { nom, email, mot_de_passe, role } = req.body;

  try {
    // Vérifier si l'utilisateur existe déjà
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'Utilisateur existe déjà' });
    }

    // Créer un nouvel utilisateur
    user = new User({
      nom,
      email,
      mot_de_passe,
      role: role || 'client'
    });

    // Sauvegarder l'utilisateur (le mot de passe sera haché par le middleware)
    await user.save();

    // Créer le payload JWT
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    // Générer le token
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '24h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error.message);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Route pour la connexion
// POST /auth/login
router.post('/login', async (req, res) => {
  const { email, mot_de_passe } = req.body;

  try {
    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Identifiants invalides' });
    }

    // Vérifier le mot de passe
    const isMatch = await user.comparePassword(mot_de_passe);
    if (!isMatch) {
      return res.status(400).json({ message: 'Identifiants invalides' });
    }

    // Créer le payload JWT
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    // Générer le token
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '24h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (error) {
    console.error('Erreur lors de la connexion:', error.message);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Route pour obtenir le profil utilisateur
// GET /auth/profil
router.get('/profil', auth, async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error.message);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;