const express = require('express');
const router = express.Router();
const axios = require('axios');
const Livraison = require('../models/Livraison');

// URL du microservice Commande
const COMMANDE_SERVICE_URL = process.env.COMMANDE_SERVICE_URL || 'http://localhost:3003';

// Ajouter une nouvelle livraison
// POST /livraison/ajouter
router.post('/ajouter', async (req, res) => {
  const { commande_id, transporteur_id, adresse_livraison } = req.body;

  if (!commande_id || !transporteur_id || !adresse_livraison) {
    return res.status(400).json({ 
      message: 'commande_id, transporteur_id, et adresse_livraison sont requis' 
    });
  }

  try {
    // Vérifier si la commande existe
    try {
      await axios.get(`${COMMANDE_SERVICE_URL}/commande/${commande_id}`);
    } catch (error) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    // Créer la livraison
    const livraison = new Livraison({
      commande_id,
      transporteur_id,
      adresse_livraison,
      statut: 'En attente'
    });

    const nouvelleLivraison = await livraison.save();

    // Mettre à jour le statut de la commande à "Expédiée"
    await axios.patch(`${COMMANDE_SERVICE_URL}/commande/${commande_id}/statut`, {
      statut: 'Expédiée'
    });

    res.status(201).json(nouvelleLivraison);
  } catch (error) {
    console.error('Erreur lors de l\'ajout de la livraison:', error.message);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Mettre à jour le statut d'une livraison
// PUT /livraison/:id
router.put('/:id', async (req, res) => {
  const { statut } = req.body;

  if (!statut || !['En attente', 'En cours', 'Livrée'].includes(statut)) {
    return res.status(400).json({ 
      message: 'Statut invalide. Statuts valides: En attente, En cours, Livrée' 
    });
  }

  try {
    const livraison = await Livraison.findById(req.params.id);
    
    if (!livraison) {
      return res.status(404).json({ message: 'Livraison non trouvée' });
    }
    
    livraison.statut = statut;
    const livraisonMiseAJour = await livraison.save();
    
    res.json(livraisonMiseAJour);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut:', error.message);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Récupérer une livraison spécifique (utile pour les tests)
// GET /livraison/:id
router.get('/:id', async (req, res) => {
  try {
    const livraison = await Livraison.findById(req.params.id);
    
    if (!livraison) {
      return res.status(404).json({ message: 'Livraison non trouvée' });
    }
    
    res.json(livraison);
  } catch (error) {
    console.error('Erreur lors de la récupération de la livraison:', error.message);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;