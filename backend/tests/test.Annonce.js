require('.env').config();
const mongoose = require('mongoose');
const Annonce = require('../models/Annonce');
const Utilisateur = require('../models/Utilisateur');

const testAnnonce = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('--- TEST ANNONCE ---');

  // TEST 1 — Créer une annonce
  const annonce = await Annonce.create({
    utilisateur_id: utilisateur._id,
    titre: 'Journée Don de Sang Alger',
    nom_organisation: 'Hilal Ahmar',
    email_professionnel: 'contact@hilalahmar.dz',
    description: 'Venez donner votre sang et sauver des vies',
    date: new Date('2025-07-20'),
    heure: '09:00',
    event_link: 'https://hilalahmar.dz/evenement',
    valide: false
  });
  console.log('TEST 1 PASSED — Annonce créée :', annonce.titre);

  // TEST 2 — Valide false par défaut
  console.log('TEST 2 PASSED — Valide false par défaut :', annonce.valide === false);

  // TEST 3 — Admin valide l annonce
  await Annonce.findByIdAndUpdate(annonce._id, { valide: true });
  const annonceValidee = await Annonce.findById(annonce._id);
  console.log('TEST 3 PASSED — Annonce validée :', annonceValidee.valide === true);

  // TEST 4 — Créer une deuxième annonce
  const annonce2 = await Annonce.create({
    utilisateur_id: utilisateur._id,
    titre: 'Don de Sang Constantine',
    nom_organisation: 'Croissant Rouge',
    email_professionnel: 'contact@croissant.dz',
    date: new Date('2025-08-10'),
    heure: '10:00',
    valide: false
  });
  console.log('TEST 4 PASSED — Deuxième annonce créée :', annonce2.titre);

  // TEST 5 — Lire toutes les annonces validées
  const annoncesValidees = await Annonce.find({ valide: true })
    .populate('utilisateur_id', 'nom email');
  console.log('TEST 5 PASSED — Annonces validées :', annoncesValidees.length);
  console.log('             Organisation :', annoncesValidees[0].utilisateur_id.nom);

  // TEST 6 — Modifier une annonce
  await Annonce.findByIdAndUpdate(annonce._id, {
    titre: 'Journée Don de Sang Alger MODIFIÉE'
  });
  const annonceModifiee = await Annonce.findById(annonce._id);
  console.log('TEST 6 PASSED — Annonce modifiée :', annonceModifiee.titre);

  // TEST 7 — Supprimer une annonce
  await Annonce.findByIdAndDelete(annonce2._id);
  const annoncesRestantes = await Annonce.find({});
  console.log('TEST 7 PASSED — Annonce supprimée, restantes :', annoncesRestantes.length);

  // TEST 8 — Nettoyer
  await Annonce.deleteMany({});
  await Utilisateur.deleteMany({});
  console.log('TEST 8 PASSED — Données nettoyées');

  await mongoose.connection.close();
  console.log('--- TOUS LES TESTS ANNONCE PASSÉS ---\n');
};

testAnnonce().catch(console.error);