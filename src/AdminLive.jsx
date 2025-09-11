import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

const FIRESTORE_REST_DOC = 'https://firestore.googleapis.com/v1/projects/kristina-driggs/databases/livepage/documents/livepage/livepage?key=AIzaSyD5ePeRatuBAFXcDC1nkTbp1vKtW_dsSr4';
const FUNCTION_URL = import.meta.env.VITE_UPDATE_LIVE_FN_URL || process.env.REACT_APP_UPDATE_LIVE_FN_URL || 'https://us-central1-kristina-driggs.cloudfunctions.net/updateLive';
console.debug('FUNCTION_URL (runtime):', FUNCTION_URL);


export default function AdminLive() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      setStatus('');
      if (u) {
        // load current live text via REST (reads from databaseId = livepage)
        try {
          const res = await fetch(FIRESTORE_REST_DOC, { cache: 'no-store' });
          if (res.ok) {
            const json = await res.json();
            const current = (json.fields && json.fields.text && json.fields.text.stringValue) || '';
            setText(current);
          } else {
            setStatus(`Failed to load live content (${res.status})`);
            setText('');
          }
        } catch (err) {
          console.error('Error reading livepage doc (REST)', err);
          setStatus('Failed to load live content');
          setText('');
        }
      } else {
        setText('');
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  async function handleLogin(e) {
    e.preventDefault();
    setStatus('');
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, pw);
      setEmail('');
      setPw('');
    } catch (err) {
      console.error('Login error', err);
      setStatus(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  async function save() {
    if (!auth || !auth.currentUser) {
      setStatus('Not authenticated');
      return;
    }
    setSaving(true);
    setStatus('');
    try {
      const idToken = await auth.currentUser.getIdToken(true);
      const resp = await fetch(FUNCTION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({ text })
      });
      if (!resp.ok) {
        const errText = await resp.text().catch(() => '');
        throw new Error(errText || `HTTP ${resp.status}`);
      }
      setStatus('Saved');
    } catch (err) {
      console.error('Save error (function)', err);
      setStatus((err && err.message) || 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div>Loading…</div>;

  if (!user) {
    return (
      <form onSubmit={handleLogin} style={{ padding: 20, maxWidth: 480,  }}>
        <div style={{ marginBottom: 8 }}>
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="email" style={{ width: '100%' }} />
        </div>
        <div style={{ marginBottom: 8 }}>
          <input value={pw} onChange={e => setPw(e.target.value)} placeholder="password" type="password" style={{ width: '100%' }} />
        </div>
        <div>
          <button type="submit" disabled={loading}>Log in</button>
        </div>
        {status && <div style={{ marginTop: 8, color: 'crimson' }}>{status}</div>}
      </form>
    );
  }

  return (
    <div style={{ padding: 20, maxWidth: 900 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h2 style={{ margin: 0 }}>Edit Live Section</h2>
        <div>
          <button onClick={() => signOut(auth)}>Sign out</button>
        </div>
      </div>

      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        rows={12}
        style={{ width: '100%', fontFamily: 'inherit' }}
        placeholder="<p>Your live events HTML here</p>"
      />

      <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
        <button onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save to site'}</button>
        <button onClick={async () => {
          try {
            const res = await fetch(FIRESTORE_REST_DOC, { cache: 'no-store' });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const json = await res.json();
            const current = (json.fields && json.fields.text && json.fields.text.stringValue) || '';
            setText(current);
            setStatus('Reloaded from backend');
          } catch (err) {
            console.error('Reload error', err);
            setStatus('Reload failed');
          }
        }}>Reload</button>
      </div>

      {status && <div style={{ marginTop: 8 }}>{status}</div>}
    </div>
  );
}
