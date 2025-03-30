Structure globale du projet
fastdelivery/
├── produit-service/
├── commande-service/
├── livraison-service/
└── auth-service/
1. Microservice "Authentification"
mkdir auth-service
cd auth-service
npm init -y
npm install express mongoose bcryptjs jsonwebtoken dotenv
npm install nodemon --save-dev
Structure du dossier
auth-service/
├── models/
│   └── User.js
├── routes/
│   └── auth.js
├── middleware/
│   └── auth.js
├── .env
└── server.js
Configuration de l'environnement (.env)
MONGO_URI=mongodb://localhost:27017/auth-service
JWT_SECRET=votre_secret_jwt
PORT=3001
2. Microservice "Produit"
   mkdir produit-service
cd produit-service
npm init -y
npm install express mongoose dotenv axios
npm install nodemon --save-dev
 Structure du dossier
produit-service/
├── models/
│   └── Produit.js
├── routes/
│   └── produit.js
├── .env
└── server.js
Configuration de l'environnement (.env)
MONGO_URI=mongodb://localhost:27017/produit-service
PORT=3002
3. Microservice "Commande"
 mkdir commande-service
cd commande-service
npm init -y
npm install express mongoose dotenv axios
npm install nodemon --save-dev
Structure du dossier
commande-service/
├── models/
│   └── Commande.js
├── routes/
│   └── commande.js
├── .env
└── server.js
Configuration de l'environnement (.env)
MONGO_URI=mongodb://localhost:27017/commande-service
PORT=3003
PRODUIT_SERVICE_URL=http://localhost:3002
4. Microservice "Livraison"
mkdir livraison-service
cd livraison-service
npm init -y
npm install express mongoose dotenv axios
npm install nodemon --save-dev
Structure du dossier
livraison-service/
├── models/
│   └── Livraison.js
├── routes/
│   └── livraison.js
├── .env
└── server.js
Configuration de l'environnement (.env)
MONGO_URI=mongodb://localhost:27017/livraison-service
PORT=3004
COMMANDE_SERVICE_URL=http://localhost:3003
