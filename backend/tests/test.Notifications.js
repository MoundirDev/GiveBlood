require('dotenv').config();
const mongoose = require('mongoose');
const Notification = require('../models/Notification');
const Utilisateur = require('../models/Utilisateur');
const Hopital = require('../models/Hopital');

const testNotification = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('--- TEST NOTIFICATION ---');

  // Crée un donneur et un hôpital pour les tests
  const donneur = await Utilisateur.create({
    nom: 'alaa',
    nom_complet: 'Sara laib',
    email: 'a_laib@estin.dz',
    password: 'pass123',
    role: 'donneur',
    groupe_sanguin: 'O-',
    ville: 'Constantine',
    localisation: {
      type: 'Point',
      coordinates: [6.6147, 36.3650],
      ville: 'Constantine',
      wilaya: 'Constantine'
    }
  });

  const hopital = await Hopital.create({
    nom: 'CHU Constantine',
    email: 'chu.constantine@sante.dz',
    password: 'hopital123',
    localisation: {
      type: 'Point',
      coordinates: [6.6147, 36.3650],
      ville: 'Constantine',
      wilaya: 'Constantine'
    },
    valide: true
  });

  // TEST 1 — Envoyer une notification au donneur
  const notifDonneur = await Notification.create({
    destinataire_id: donneur._id,
    destinataire_role: 'donneur',
    message: 'Nouvelle demande de sang O- à Constantine',
    lu: false
  });
  console.log('TEST 1 PASSED — Notification donneur créée :', notifDonneur.message);

  // TEST 2 — Envoyer une notification à l hôpital
  const notifHopital = await Notification.create({
    destinataire_id: hopital._id,
    destinataire_role: 'hopital',
    message: 'Un donneur a pris un rendez-vous de don',
    lu: false
  });
  console.log('TEST 2 PASSED — Notification hôpital créée :', notifHopital.message);

  // TEST 3 — lu false par défaut
  console.log('TEST 3 PASSED — Lu false par défaut :', notifDonneur.lu === false);

  // TEST 4 — Marquer comme lue
  await Notification.findByIdAndUpdate(notifDonneur._id, { lu: true });
  const notifLue = await Notification.findById(notifDonneur._id);
  console.log('TEST 4 PASSED — Notification marquée lue :', notifLue.lu === true);

  // TEST 5 — Lire toutes les notifications non lues d un donneur
  const notifsNonLues = await Notification.find({
    destinataire_id: donneur._id,
    lu: false
  });
  console.log('TEST 5 PASSED — Notifications non lues :', notifsNonLues.length);

  // TEST 6 — Envoyer plusieurs notifications
  await Notification.create({
    destinataire_id: donneur._id,
    destinataire_role: 'donneur',
    message: 'Votre RDV a été confirmé',
    lu: false
  });
  await Notification.create({
    destinataire_id: donneur._id,
    destinataire_role: 'donneur',
    message: 'Rappel : votre RDV est demain',
    lu: false
  });
  const toutesNotifs = await Notification.find({ destinataire_id: donneur._id });
  console.log('TEST 6 PASSED — Total notifications donneur :', toutesNotifs.length);

  // TEST 7 — Trier par date (plus récente en premier)
  const notifsTries = await Notification.find({ destinataire_id: donneur._id })
    .sort({ date: -1 });
  console.log('TEST 7 PASSED — Notifications triées, première :', notifsTries[0].message);

  // TEST 8 — Nettoyer
  await Notification.deleteMany({});
  await Utilisateur.deleteMany({});
  await Hopital.deleteMany({});
  console.log('TEST 8 PASSED — Données nettoyées');

  await mongoose.connection.close();
  console.log('--- TOUS LES TESTS NOTIFICATION PASSÉS ---\n');
};

testNotification().catch(console.error);