const express = require('express');
const router = express.Router();
const axios = require('axios');
const Commande = require('../models/Commande');

// URL du microservice Produit
const PRODUIT_SERVICE_URL = process.env.PRODUIT_SERVICE_URL || 'http://localhost:3002';

// Ajouter une nouvelle commande
// POST /commande/ajouter
router.post('/ajouter', async (req, res) => {
  const { produits, client_id } = req.body;

  if (!produits || produits.length === 0 || !client_id) {
    return res.status(400).json({ message: 'Produits et client_id sont requis' });
  }

  try {
    // Vérifier les produits et calculer le prix total
    let prix_total = 0;
    const produitsValides = [];

    // Vérifier chaque produit
    for (const item of produits) {
      try {
        // Récupérer les informations du produit
        const response = await axios.get(`${PRODUIT_SERVICE_URL}/produit/${item.produit_id}`);
        const produit = response.data;

        // Vérifier le stock
        if (produit.stock < item.quantite) {
          return res.status(400).json({ 
            message: `Stock insuffisant pour ${produit.nom}. Disponible: ${produit.stock}`
          });
        }

        // Ajouter au prix total
        const prix_produit = produit.prix * item.quantite;
        prix_total += prix_produit;

        // Ajouter aux produits valides
        produitsValides.push({
          produit_id: item.produit_id,
          nom: produit.nom,
          prix: produit.prix,
          quantite: item.quantite
        });

        // Mettre à jour le stock
        await axios.patch(`${PRODUIT_SERVICE_URL}/produit/${item.produit_id}/stock`, {
          quantite: produit.stock - item.quantite
        });
      } catch (error) {
        return res.status(404).json({ message: `Produit ${item.produit_id} non trouvé` });
      }
    }

    // Créer la commande
    const commande = new Commande({
      produits: produitsValides,
      client_id,
      prix_total,
      statut: 'En attente'
    });

    const nouvelleCommande = await commande.save();
    res.status(201).json(nouvelleCommande);
  } catch (error) {
    console.error('Erreur lors de l\'ajout de la commande:', error.message);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Récupérer une commande spécifique
// GET /commande/:id
router.get('/:id', async (req, res) => {
  try {
    const commande = await Commande.findById(req.params.id);
    
    if (!commande) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }
    
    res.json(commande);
  } catch (error) {
    console.error('Erreur lors de la récupération de la commande:', error.message);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Mettre à jour le statut d'une commande
// PATCH /commande/:id/statut
router.patch('/:id/statut', async (req, res) => {
  const { statut } = req.body;

  if (!statut || !['En attente', 'Confirmée', 'Expédiée'].includes(statut)) {
    return res.status(400).json({ 
      message: 'Statut invalide. Statuts valides: En attente, Confirmée, Expédiée' 
    });
  }

  try {
    const commande = await Commande.findById(req.params.id);
    
    if (!commande) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }
    
    commande.statut = statut;
    const commandeMiseAJour = await commande.save();
    
    res.json(commandeMiseAJour);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut:', error.message);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;