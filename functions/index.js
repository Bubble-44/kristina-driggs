const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const { GoogleAuth } = require('google-auth-library');
const fetch = require('node-fetch'); // keep v2 for compatibility

admin.initializeApp();

const PROJECT_ID = process.env.GCP_PROJECT || process.env.GCLOUD_PROJECT || 'kristina-driggs';
const DATABASE_ID = 'livepage';
const ADMIN_UIDS = (process.env.ADMIN_UIDS || '').split(',').map(s => s.trim()).filter(Boolean);

async function getServiceAccessToken() {
  const auth = new GoogleAuth({
    scopes: ['https://www.googleapis.com/auth/datastore', 'https://www.googleapis.com/auth/cloud-platform']
  });
  const client = await auth.getClient();
  const tokenResp = await client.getAccessToken();
  return tokenResp && tokenResp.token ? tokenResp.token : tokenResp;
}

const app = express();

// Allow CORS from any origin for now (change origin as needed)
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '1mb' }));

app.post('/', async (req, res) => {
  try {
    const authHeader = req.get('Authorization') || '';
    const idToken = (authHeader.startsWith('Bearer ') && authHeader.split('Bearer ')[1]) || req.body.idToken;
    if (!idToken) return res.status(401).json({ error: 'Unauthorized: missing ID token' });

    let decoded;
    try {
      decoded = await admin.auth().verifyIdToken(idToken);
    } catch (err) {
      console.error('verifyIdToken failed', err);
      return res.status(401).json({ error: 'Unauthorized: invalid ID token' });
    }

    if (ADMIN_UIDS.length && !ADMIN_UIDS.includes(decoded.uid)) {
      return res.status(403).json({ error: 'Forbidden: not an admin' });
    }

    const { text } = req.body || {};
    if (typeof text !== 'string') return res.status(400).json({ error: 'Bad request: missing text' });

    const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/${DATABASE_ID}/documents/livepage/livepage`;

    let accessToken;
    try {
      accessToken = await getServiceAccessToken();
    } catch (err) {
      console.error('failed to get service access token', err);
      return res.status(500).json({ error: 'Server auth error' });
    }

    const body = { fields: { text: { stringValue: text } } };

    const resp = await fetch(url, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!resp.ok) {
      const errText = await resp.text().catch(() => '');
      console.error('Firestore REST write failed', resp.status, errText);
      return res.status(500).json({ error: 'Firestore write failed', detail: errText });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Unhandled error in updateLive', err);
    return res.status(500).json({ error: 'internal error' });
  }
});

// Export the express app as an HTTPS function
exports.updateLive = functions.https.onRequest(app);