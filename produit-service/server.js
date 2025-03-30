const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Charger les variables d'environnement
dotenv.config();

// Initialiser l'application Express
const app = express();

// Middleware pour parser le JSON
app.use(express.json());

// Connecter à MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connecté'))
  .catch(err => console.error('Erreur de connexion MongoDB:', err));

// Définir les routes
app.use('/produit', require('./routes/produit'));

// Route de base
app.get('/', (req, res) => {
  res.send('API Microservice Produit');
});

// Démarrer le serveur
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));