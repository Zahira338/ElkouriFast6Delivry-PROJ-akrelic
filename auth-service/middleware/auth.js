const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  // Récupérer le token du header
  const token = req.header('x-auth-token');

  // Vérifier si le token existe
  if (!token) {
    return res.status(401).json({ message: 'Accès refusé, token manquant' });
  }

  try {
    // Vérifier le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Récupérer l'utilisateur du payload
    const user = await User.findById(decoded.user.id).select('-mot_de_passe');
    
    if (!user) {
      return res.status(401).json({ message: 'Utilisateur invalide' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token invalide' });
  }
};