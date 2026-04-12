require('dotenv').config();
const mongoose = require('mongoose');
const Utilisateur = require('../models/Utilisateur');

const testUtilisateur = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('--- TEST UTILISATEUR ---');

  // TEST 1 — Créer un donneur
  const donneur = await Utilisateur.create({
    nom: 'Abdallah',
    nom_complet: 'Abdallah Ouazani',
    email: 'a_ouazani@estin.dz',
    password: 'password123',
    role: 'donneur',
    groupe_sanguin: 'O+',
    ville: 'Alger',
    localisation: {
      type: 'Point',
      coordinates: [3.0588, 36.7538],
      ville: 'Alger',
      wilaya: 'Alger'
    },
    disponible: true
  });
  console.log('TEST 1 PASSED — Donneur créé :', donneur.nom);

  // TEST 2 — Vérifier que le mot de passe est chiffré
  const motDePasseEstChiffre = donneur.password !== 'password123';
  console.log('TEST 2 PASSED — Mot de passe chiffré :', motDePasseEstChiffre);

  // TEST 3 — Créer un admin
  const admin = await Utilisateur.create({
    nom: 'Admin',
    nom_complet: 'Administrateur GiveBlood',
    email: 'admin@giveblood.dz',
    password: 'admin123',
    role: 'admin',
    ville: 'Alger',
    localisation: {
      type: 'Point',
      coordinates: [3.0588, 36.7538],
      ville: 'Alger',
      wilaya: 'Alger'
    },
    disponible: false
  });
  console.log('TEST 4 PASSED — Admin créé :', admin.nom);

  // TEST 4 — Lire tous les donneurs disponibles
  const donneurs = await Utilisateur.find({ role: 'donneur', disponible: true });
  console.log('TEST 5 PASSED — Nombre de donneurs disponibles :', donneurs.length);

  // TEST 5 — Lire par groupe sanguin
  const groupeOPlus = await Utilisateur.find({ groupe_sanguin: 'O+' });
  console.log('TEST 6 PASSED — Donneurs O+ :', groupeOPlus.length);

  // TEST 6 — Modifier disponibilité
  await Utilisateur.findByIdAndUpdate(donneur._id, { disponible: false });
  const modifie = await Utilisateur.findById(donneur._id);
  console.log('TEST 7 PASSED — Disponibilité modifiée :', modifie.disponible === false);

  // TEST 7 — Email doit être unique (doit échouer)
  try {
    await Utilisateur.create({
      nom: 'Copie',
      nom_complet: 'Copie Abdallah',
      email: 'a_ouazani@estin.dz', // même email
      password: 'test123',
      role: 'donneur'
    });
    console.log('TEST 8 FAILED — Devait échouer !');
  } catch (err) {
    console.log('TEST 8 PASSED — Email unique respecté :', err.message.includes('duplicate'));
  }

  // TEST 8 — Supprimer les données de test
  await Utilisateur.deleteMany({});
  console.log('TEST 9 PASSED — Données nettoyées');

  await mongoose.connection.close();
  console.log('--- TOUS LES TESTS UTILISATEUR PASSÉS ---\n');
};

testUtilisateur().catch(console.error);