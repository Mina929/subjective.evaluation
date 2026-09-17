/* const express = require('express');
const cors = require('cors');
const app = express();
//const port = 3001;
const port = process.env.PORT || 3001;
const db = require('./db/database');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enregistrer un participant
app.post('/api/save-participant', (req, res) => {
    const { firstName, lastName, job } = req.body;

    db.execute(
        'INSERT INTO participants (first_name, last_name, job) VALUES (?, ?, ?)',
        [firstName, lastName, job],
        (err, result) => {
            if (err) {
                console.error('❌ Erreur SQL :', err);
                return res.status(500).send('Erreur serveur');
            }
            res.json({ participantId: result.insertId });
        }
    );
});

// Enregistrer un MOS global
app.post('/api/save-mos', (req, res) => {
    const { participantId, mosScore } = req.body;

    db.execute(
        'INSERT INTO mos (participant_id, mos_score) VALUES (?, ?)',
        [participantId, mosScore],
        (err) => {
            if (err) {
                console.error('❌ Erreur SQL :', err);
                return res.status(500).send('Erreur serveur');
            }
            res.send('MOS enregistré');
        }
    );
});

// Enregistrer un score d'intelligibilité pour un speaker
app.post('/api/save-intelligibility', (req, res) => {
    const { participantId, speakerId, intelligibilityScore } = req.body;

    console.log('📥 Données intelligibility reçues :', { participantId, speakerId, intelligibilityScore });

    db.execute(
        'INSERT INTO intelligibility (participant_id, speaker_id, intelligibility_score) VALUES (?, ?, ?)',
        [participantId, speakerId, intelligibilityScore],
        (err) => {
            if (err) {
                console.error('❌ Erreur SQL :', err);
                return res.status(500).send('Erreur serveur');
            }
            res.send('Score intelligibility enregistré');
        }
    );
});



// Récupérer le prénom et nom du participant
app.get('/api/get-participant/:id', (req, res) => {
    const participantId = req.params.id;

    db.execute(
        'SELECT first_name, last_name FROM participants WHERE id = ?',
        [participantId],
        (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Erreur serveur');
            }
            if (results.length === 0) {
                return res.status(404).send('Participant non trouvé');
            }
            res.json(results[0]);  // Renvoie { first_name: '...', last_name: '...' }
        }
    );
});

// Démarrer le serveur
app.listen(port, () => {
    console.log(`🚀 Serveur Express actif : http://localhost:${port}`);
});
 */
 
 const express = require('express');
const cors = require('cors');
const next = require('next');

const db = require('./db/database');

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

const port = process.env.PORT || 3001;

nextApp.prepare().then(() => {
    const app = express();

    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Enregistrer un participant
    app.post('/api/save-participant', (req, res) => {
        const { firstName, lastName, job } = req.body;

        db.execute(
            'INSERT INTO participants (first_name, last_name, job) VALUES (?, ?, ?)',
            [firstName, lastName, job],
            (err, result) => {
                if (err) {
                    console.error('❌ Erreur SQL :', err);
                    return res.status(500).send('Erreur serveur');
                }
                res.json({ participantId: result.insertId });
            }
        );
    });

    // Enregistrer un MOS global
    app.post('/api/save-mos', (req, res) => {
        const { participantId, mosScore } = req.body;

        db.execute(
            'INSERT INTO mos (participant_id, mos_score) VALUES (?, ?)',
            [participantId, mosScore],
            (err) => {
                if (err) {
                    console.error('❌ Erreur SQL :', err);
                    return res.status(500).send('Erreur serveur');
                }
                res.send('MOS enregistré');
            }
        );
    });

    // Enregistrer un score d'intelligibilité
    app.post('/api/save-intelligibility', (req, res) => {
        const { participantId, speakerId, intelligibilityScore } = req.body;

        console.log('📥 Données intelligibility reçues :', {
            participantId,
            speakerId,
            intelligibilityScore
        });

        db.execute(
            'INSERT INTO intelligibility (participant_id, speaker_id, intelligibility_score) VALUES (?, ?, ?)',
            [participantId, speakerId, intelligibilityScore],
            (err) => {
                if (err) {
                    console.error('❌ Erreur SQL :', err);
                    return res.status(500).send('Erreur serveur');
                }
                res.send('Score intelligibility enregistré');
            }
        );
    });

    // Récupérer le participant
    app.get('/api/get-participant/:id', (req, res) => {
        const participantId = req.params.id;

        db.execute(
            'SELECT first_name, last_name FROM participants WHERE id = ?',
            [participantId],
            (err, results) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Erreur serveur');
                }

                if (results.length === 0) {
                    return res.status(404).send('Participant non trouvé');
                }

                res.json(results[0]);
            }
        );
    });

    // Toutes les autres requêtes sont gérées par Next.js
    app.use((req, res) => {
        return handle(req, res);
    });

    app.listen(port,'0.0.0.0', () => {
        console.log(`🚀 Serveur Next.js + Express actif sur le port ${port}`);
    });
});