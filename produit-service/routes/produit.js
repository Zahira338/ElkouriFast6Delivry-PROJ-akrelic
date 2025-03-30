const express = require('express');
const router = express.Router();
const Produit = require('../models/Produit');

// Ajouter un nouveau produit
// POST /produit/ajouter
router.post('/ajouter', async (req, res) => {
  const { nom, description, prix, stock } = req.body;

  try {
    const produit = new Produit({
      nom,
      description,
      prix,
      stock
    });

    const nouveauProduit = await produit.save();
    res.status(201).json(nouveauProduit);
  } catch (error) {
    console.error('Erreur lors de l\'ajout du produit:', error.message);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Récupérer un produit spécifique
// GET /produit/:id
router.get('/:id', async (req, res) => {
  try {
    const produit = await Produit.findById(req.params.id);
    
    if (!produit) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }
    
    res.json(produit);
  } catch (error) {
    console.error('Erreur lors de la récupération du produit:', error.message);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Mettre à jour le stock d'un produit
// PATCH /produit/:id/stock
router.patch('/:id/stock', async (req, res) => {
  const { quantite } = req.body;

  if (!quantite) {
    return res.status(400).json({ message: 'La quantité est requise' });
  }

  try {
    const produit = await Produit.findById(req.params.id);
    
    if (!produit) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }
    
    // Mettre à jour le stock
    produit.stock = quantite;
    
    const produitMisAJour = await produit.save();
    res.json(produitMisAJour);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du stock:', error.message);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Route pour récupérer tous les produits (utile pour les tests)
// GET /produit
router.get('/', async (req, res) => {
  try {
    const produits = await Produit.find();
    res.json(produits);
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error.message);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;