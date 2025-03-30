const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Charger les variables d'environnement
dotenv.config();

console.log('MONGO_URI:', process.env.MONGO_URI); // Ligne à ajouter pour

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
app.use('/auth', require('./routes/auth'));

// Route de base
app.get('/', (req, res) => {
  res.send('API Microservice Authentification');
});

// Démarrer le serveur
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));