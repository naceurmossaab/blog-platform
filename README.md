# 📦 MEAN Stack Project

Ce projet est une application web full-stack basée sur le stack **MEAN** :
- **MongoDB** : base de données NoSQL
- **Express.js** : framework backend pour Node.js
- **Angular** : framework frontend
- **Node.js** : environnement serveur

---

## 📁 Structure du projet

```
mean-project/
├── api/               # Backend Node.js + Express
│   ├── controllers/   # Logique métier
│   ├── db/            # Connecttion database
│   ├── errors/        # Class pour specific erreur
│   ├── middlewares/   # Validation et authentication and autre middlewares
│   ├── models/        # Modèles de données (Mongoose)
│   ├── public/        # pour les images telechargé local
│   ├── routes/        # Définition des routes API
│   ├── utils/         # functions
│   ├── validations/   # Schémas de validation (Joi)
│   └── app.js         # Point d'entrée de l'application Express
│
├── client/            # Frontend Angular
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/ # Composants UI
│   │   │   ├── services/   # Services HTTP
│   │   │   └── pages/      # Pages principales
│   │   └── main.ts         # Fichier principal
│   └── angular.json        # Configuration Angular
│
└── README.md          # Documentation du projet
```

---

## 🚀 Installation & Lancement

### ✅ Prérequis

- Node.js v20+
- MongoDB (local ou MongoDB Atlas)
- Angular CLI (`npm install -g @angular/cli`)

---

### 🔧 Installation Backend (API)

1. Aller dans le dossier `api` :

```bash
cd api
```

2. Installer les dépendances :

```bash
npm install
```

3. Créer un fichier `.env` à la racine du dossier `api` :

```env
NODE_ENV=development
PORT=5000
JWT_SECRET=your_secret_jwt
ACCESS_TOKEN_LIFETIME='15m' # 15 minutes
REFRESH_TOKEN_LIFETIME=2592000000 # 30 days in milliseconds
CLIENT_URL=http://localhost:4200
MONGO_URI=mongodb://localhost:27017/blog-db
```

4. Lancer le serveur :

```bash
npm start
```

Le backend sera accessible sur `http://localhost:5000`.

---

### 🖥️ Installation Frontend (Angular)

1. Aller dans le dossier `client` :

```bash
cd ../client
```

2. Installer les dépendances Angular :

```bash
npm install
```

3. Lancer l’application Angular :

```bash
ng serve
```

L’application sera accessible sur `http://localhost:4200`.

---

## ⚙️ Choix techniques

### Backend (Express.js + Node.js)
- **Joi** : utilisé pour la validation des données côté backend (ex : formats d’e-mails, mots de passe, objets).
- **Mongoose** : ODM pour interagir avec MongoDB.
- **Structure MVC** : séparation claire des routes, contrôleurs, modèles et validations.

### Frontend (Angular)
- **Angular Material** : bibliothèque de composants UI pour une interface moderne et responsive.
- **Services Angular** : utilisés pour interagir avec l’API via `HttpClient`.
- **Routing Angular** : gestion des routes et des modules associés.

---

## ✅ Fonctionnalités

- Inscription / Connexion d’utilisateurs
- Appels API sécurisés
- Interface utilisateur responsive avec Angular Material
- Validation des données côté serveur (Joi)
