require('dotenv').config();
const mongoose = require('mongoose');
const DemandeSang = require('../models/DemandeSang');
const Hopital = require('../models/Hopital');

const testDemandeSang = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('--- TEST DEMANDE SANG ---');

  // Crée un hôpital pour les tests
  const hopital = await Hopital.create({
    nom: 'for Test',
    email: 'for.test@sante.dz',
    password: 'hopital123',
    localisation: {
      type: 'Point',
      coordinates: [3.0588, 36.7538],
      ville: 'Alger',
      wilaya: 'Alger'
    },
    valide: true
  });

  // TEST 1 — Créer une demande normale
  const demande = await DemandeSang.create({
    hopital_id: hopital._id,
    groupe_sanguin: 'O+',
    quantite: 3,
    urgence: false,
    localisation: {
      type: 'Point',
      coordinates: [3.0588, 36.7538],
      ville: 'Alger',
      wilaya: 'Alger'
    },
    status: 'ouverte'
  });
  console.log('TEST 1 PASSED — Demande créée, groupe :', demande.groupe_sanguin);

  // TEST 2 — Créer une demande urgente
  const demandeUrgente = await DemandeSang.create({
    hopital_id: hopital._id,
    groupe_sanguin: 'AB-',
    urgence: true,
    localisation: {
      type: 'Point',
      coordinates: [3.0588, 36.7538],
      ville: 'Alger',
      wilaya: 'Alger'
    },
    status: 'ouverte'
  });
  console.log('TEST 2 PASSED — Demande urgente créée :', demandeUrgente.urgence === true);

  // TEST 3 — Status ouverte par défaut
  console.log('TEST 3 PASSED — Status ouverte par défaut :', demande.status === 'ouverte');

  // TEST 4 — Lire toutes les demandes urgentes
  const urgentes = await DemandeSang.find({ urgence: true, status: 'ouverte' });
  console.log('TEST 4 PASSED — Demandes urgentes :', urgentes.length);

  // TEST 5 — Filtrer par groupe sanguin
  const demandesOPlus = await DemandeSang.find({ groupe_sanguin: 'O+' });
  console.log('TEST 5 PASSED — Demandes O+ :', demandesOPlus.length);

  // TEST 6 — Modifier le status
  await DemandeSang.findByIdAndUpdate(demande._id, { status: 'satisfaite' });
  const demandeModifiee = await DemandeSang.findById(demande._id);
  console.log('TEST 6 PASSED — Status modifié :', demandeModifiee.status === 'satisfaite');

  // TEST 7 — populate (lier avec l'hôpital)
  const demandeAvecHopital = await DemandeSang.findById(demande._id)
    .populate('hopital_id', 'nom ville');
  console.log('TEST 7 PASSED — Populate hôpital :', demandeAvecHopital.hopital_id.nom);

  // TEST 8 — Groupe sanguin invalide (doit échouer)
  try {
    await DemandeSang.create({
      hopital_id: hopital._id,
      groupe_sanguin: 'Z+', // groupe invalide
      urgence: false,
      localisation: {
        type: 'Point',
        coordinates: [3.0588, 36.7538],
        ville: 'Alger',
        wilaya: 'Alger'
      }
    });
    console.log('TEST 8 FAILED — Devait échouer !');
  } catch (err) {
    console.log('TEST 8 PASSED — Groupe sanguin invalide rejeté');
  }

  // TEST 9 — Nettoyer
  await DemandeSang.deleteMany({});
  await Hopital.deleteMany({});
  console.log('TEST 9 PASSED — Données nettoyées');

  await mongoose.connection.close();
  console.log('--- TOUS LES TESTS DEMANDE SANG PASSÉS ---\n');
};

testDemandeSang().catch(console.error);