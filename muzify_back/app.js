const express = require("express");
const bcrypt = require("bcrypt");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000;

const usersFilePath = path.join(__dirname, "users.json");
const albumsFilePath = path.join(__dirname, "data.json"); // Chemin vers le fichier albums.json

// Fonction pour lire les utilisateurs depuis le fichier
function readUsers() {
  if (!fs.existsSync(usersFilePath)) {
    fs.writeFileSync(usersFilePath, JSON.stringify([]));
    return [];
  }
  const data = fs.readFileSync(usersFilePath);
  return JSON.parse(data);
}

// Fonction pour écrire les utilisateurs dans le fichier
function writeUsers(users) {
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
}

// Fonction pour lire les albums depuis le fichier
function readAlbums() {
  if (!fs.existsSync(albumsFilePath)) {
    fs.writeFileSync(albumsFilePath, JSON.stringify([]));
    return [];
  }
  const data = fs.readFileSync(albumsFilePath);
  return JSON.parse(data);
}

// Génération d'une clé secrète pour JWT
const generateSecret = () => {
  return crypto.randomBytes(64).toString("hex");
};

const JWT_SECRET = generateSecret(); // Génération de la clé secrète

app.use(express.json());

// Inscription
app.post("/api/register", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: "Tous les champs sont requis" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const users = readUsers();

  // Vérification si l'email est déjà utilisé
  const existingUser = users.find((user) => user.email === email);
  if (existingUser) {
    return res.status(400).json({ error: "L'email est déjà utilisé" });
  }

  const user = { id: Date.now(), username, email, password: hashedPassword };
  users.push(user);
  writeUsers(users); // Écrire le nouvel utilisateur dans le fichier
  res.status(201).json({ message: "Utilisateur créé avec succès" });
});

// Connexion
// Connexion
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  const users = readUsers();
  const user = users.find((user) => user.email === email);

  if (!user) {
    return res.status(404).json({ error: "Utilisateur non trouvé" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ error: "Mot de passe incorrect" });
  }

  const token = jwt.sign(
    { username: user.username, email: user.email },
    JWT_SECRET,
    { expiresIn: "2h" }
  );

  res.json({ token, username: user.username, email: user.email }); 
});

// Middleware pour vérifier le token
const authenticateToken = (req, res, next) => {
  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1]; // Extraire le token
  if (!token) {
    return res.status(401).json({ error: "Token introuvable" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Token invalide" });
    }
    req.user = user; // Assigner l'utilisateur à la requête
    next();
  });
};

// Route protégée
app.get("/api/users", authenticateToken, (req, res) => {
  res.json({ message: "Vous êtes authentifié", user: req.user });
});

// Récupérer tous les albums
app.get("/api/albums", (req, res) => {
  const albums = readAlbums();
  res.json(albums);
});

app.get("/api/albums/:id", (req, res) => {
  try {
    const data = readAlbums(); // Lire les données
    const albums = data.ALBUMS || []; // Accéder au tableau d'albums

    console.log("Albums chargés:", albums); // Log des albums

    const album = albums.find((a) => a.id === req.params.id); // Comparer les IDs

    if (!album) {
      return res.status(404).json({ error: "Album non trouvé" });
    }

    res.json(album);
  } catch (error) {
    console.error("Erreur lors de la récupération de l'album:", error);
    return res.status(500).json({ error: "Erreur interne du serveur" });
  }
});

// Récupérer toutes les listes de chansons
app.get("/api/album-lists", (req, res) => {
  const data = readAlbums();
  const albumLists = data.ALBUM_LISTS;
  res.json(albumLists);
});

// Déconnexion
app.post("/api/logout", (req, res) => {
  res.json({ message: "Déconnexion réussie" });
});

app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
});
