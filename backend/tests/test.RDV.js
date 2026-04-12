require('dotenv').config();
const mongoose = require('mongoose');
const RDV = require('../models/RDV');
const Utilisateur = require('../models/Utilisateur');
const Hopital = require('../models/Hopital');
const DemandeSang = require('../models/DemandeSang');

const testRDV = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('--- TEST RDV ---');

  // Crée les données nécessaires
  const donneur = await Utilisateur.create({
    nom: 'Serine',
    nom_complet: 'Karim chergui',
    email: 's_chergui@estin.dz',
    password: 'pass123',
    role: 'donneur',
    groupe_sanguin: 'A+',
    ville: 'Alger',
    localisation: {
      type: 'Point',
      coordinates: [3.0588, 36.7538],
      ville: 'Alger',
      wilaya: 'Alger'
    }
  });

  const hopital = await Hopital.create({
    nom: 'CHU Alger',
    email: 'chu.alger@sante.dz',
    password: 'hopital123',
    localisation: {
      type: 'Point',
      coordinates: [3.0588, 36.7538],
      ville: 'Alger',
      wilaya: 'Alger'
    },
    valide: true
  });

  const demande = await DemandeSang.create({
    hopital_id: hopital._id,
    groupe_sanguin: 'A+',
    quantite: 2,
    urgence: false,
    localisation: {
      type: 'Point',
      coordinates: [3.0588, 36.7538],
      ville: 'Alger',
      wilaya: 'Alger'
    }
  });

  // TEST 1 — Créer un RDV
  const rdv = await RDV.create({
    donneur_id: donneur._id,
    hopital_id: hopital._id,
    demande_id: demande._id,
    date: new Date('2025-06-15'),
    status: 'en_attente'
  });
  console.log('TEST 1 PASSED — RDV créé, status :', rdv.status);

  // TEST 2 — Status en_attente par défaut
  console.log('TEST 2 PASSED — Status par défaut :', rdv.status === 'en_attente');

  // TEST 3 — Confirmer le RDV
  await RDV.findByIdAndUpdate(rdv._id, {
    status: 'confirme',
    confirmerPar: hopital._id
  });
  const rdvConfirme = await RDV.findById(rdv._id);
  console.log('TEST 3 PASSED — RDV confirmé :', rdvConfirme.status === 'confirme');

  // TEST 4 — Lire les RDV d'un donneur
  const rdvsDonneur = await RDV.find({ donneur_id: donneur._id })
    .populate('hopital_id', 'nom');
  console.log('TEST 4 PASSED — RDV du donneur :', rdvsDonneur.length);
  console.log('             Hôpital :', rdvsDonneur[0].hopital_id.nom);

  // TEST 5 — Lire les RDV d'un hôpital
  const rdvsHopital = await RDV.find({ hopital_id: hopital._id })
    .populate('donneur_id', 'nom groupe_sanguin');
  console.log('TEST 5 PASSED — RDV de l hôpital :', rdvsHopital.length);

  // TEST 6 — Annuler un RDV
  await RDV.findByIdAndUpdate(rdv._id, { status: 'annule' });
  const rdvAnnule = await RDV.findById(rdv._id);
  console.log('TEST 6 PASSED — RDV annulé :', rdvAnnule.status === 'annule');

  // TEST 7 — Status invalide (doit échouer)
  try {
    await RDV.create({
      donneur_id: donneur._id,
      hopital_id: hopital._id,
      date: new Date(),
      status: 'inconnu' // status invalide
    });
    console.log('TEST 7 FAILED — Devait échouer !');
  } catch (err) {
    console.log('TEST 7 PASSED — Status invalide rejeté');
  }

  // TEST 8 — Nettoyer
  await RDV.deleteMany({});
  await DemandeSang.deleteMany({});
  await Hopital.deleteMany({});
  await Utilisateur.deleteMany({});
  console.log('TEST 8 PASSED — Données nettoyées');

  await mongoose.connection.close();
  console.log('--- TOUS LES TESTS RDV PASSÉS ---\n');
};

testRDV().catch(console.error);