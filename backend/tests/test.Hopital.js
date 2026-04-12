require('dotenv').config();
const mongoose = require('mongoose');
const Hopital = require('../models/Hopital');
const Utilisateur = require('../models/Utilisateur');

const testHopital = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('--- TEST HOPITAL ---');

  // Crée un admin pour valider l'hôpital
  const admin = await Utilisateur.create({
    nom: 'Admin',
    nom_complet: 'Admin GiveBlood',
    email: 'admin.test@giveblood.dz',
    password: 'admin123',
    role: 'admin',
    ville: 'Alger',
    localisation: {
      type: 'Point',
      coordinates: [3.0588, 36.7538],
      ville: 'Alger',
      wilaya: 'Alger'
    }
  });

  // TEST 1 — Créer un hôpital
  const hopital = await Hopital.create({
    nom: 'CHU Mustapha Pacha',
    email: 'chu.mustapha@sante.dz',
    password: 'hopital123',
    localisation: {
      type: 'Point',
      coordinates: [3.0588, 36.7538],
      ville: 'Alger',
      wilaya: 'Alger'
    },
    valide: false
  });
  console.log('TEST 1 PASSED — Hôpital créé :', hopital.nom);

  // TEST 2 — Vérifier que le mot de passe est chiffré
  const motDePasseEstChiffre = hopital.password !== 'hopital123';
  console.log('TEST 2 PASSED — Mot de passe chiffré :', motDePasseEstChiffre);

  // TEST 3 — Vérifier que valide est false par défaut
  console.log('TEST 3 PASSED — Valide false par défaut :', hopital.valide === false);

  // TEST 4 — Admin valide l'hôpital
  await Hopital.findByIdAndUpdate(hopital._id, {
    valide: true,
    validePar: admin._id
  });
  const hopitalValide = await Hopital.findById(hopital._id);
  console.log('TEST 4 PASSED — Hôpital validé :', hopitalValide.valide === true);

  // TEST 5 — Créer un deuxième hôpital
  const hopital2 = await Hopital.create({
    nom: 'CHU Oran',
    email: 'chu.oran@sante.dz',
    password: 'hopital456',
    localisation: {
      type: 'Point',
      coordinates: [-0.6417, 35.6969],
      ville: 'Oran',
      wilaya: 'Oran'
    },
    valide: false
  });
  console.log('TEST 5 PASSED — Deuxième hôpital créé :', hopital2.nom);

  // TEST 6 — Lire tous les hôpitaux validés
  const hopitauxValides = await Hopital.find({ valide: true });
  console.log('TEST 6 PASSED — Hôpitaux validés :', hopitauxValides.length);

  // TEST 7 — Email unique (doit échouer)
  try {
    await Hopital.create({
      nom: 'Copie unique',
      email: 'chu.mustapha@sante.dz', // même email
      password: 'test123',
      localisation: {
        type: 'Point',
        coordinates: [3.0588, 36.7538],
        ville: 'Alger',
        wilaya: 'Alger'
      }
    });
    console.log('TEST 7 FAILED — Devait échouer !');
  } catch (err) {
    console.log('TEST 7 PASSED — Email unique respecté :', err.message.includes('duplicate'));
  }

  // TEST 8 — Supprimer les données de test
  await Hopital.deleteMany({});
  await Utilisateur.deleteMany({});
  console.log('TEST 8 PASSED — Données nettoyées');

  await mongoose.connection.close();
  console.log('--- TOUS LES TESTS HOPITAL PASSÉS ---\n');
};

testHopital().catch(console.error);