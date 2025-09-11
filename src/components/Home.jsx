import React, { useState, useEffect } from 'react';
import '../styles/home.scss';
import NavBar from './Nav-Bar';
import Hero from '../assets/Hero.png';
import BioPic from '../assets/Bio_Pic.png';
import faceBookIcon from '../assets/faceBookIcon.svg';
import instaGramIcon from '../assets/instaGramIcon.svg';
import youTubeIcon from '../assets/youTubeIcon.svg';
import Player from './Player';

import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

export default function Home({ menuOpen, setMenuOpen, externalSection, clearOverlay, onNavigate }) {
  const [section, setSection] = useState(null);
  const [isLandscapeLayout, setIsLandscapeLayout] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [liveText, setLiveText] = useState('');
  const FADE_MS = 420;

  useEffect(() => {
    if (typeof externalSection !== 'undefined') setSection(externalSection);
  }, [externalSection]);

  useEffect(() => {
    const mediaQuery = '(orientation: landscape) and (max-width: 1000px)';
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia(mediaQuery);
    const handler = (e) => setIsLandscapeLayout(!!e.matches);
    handler(mq);
    if (mq.addEventListener) mq.addEventListener('change', handler);
    else mq.addListener(handler);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', handler);
      else mq.removeListener(handler);
    };
  }, []);
const FIRESTORE_REST_DOC = 'https://firestore.googleapis.com/v1/projects/kristina-driggs/databases/livepage/documents/livepage/livepage?key=AIzaSyD5ePeRatuBAFXcDC1nkTbp1vKtW_dsSr4';

  useEffect(() => {
    // Poll Firestore REST document (databaseId = livepage) every 10 seconds
    let mounted = true;
    const fetchLive = async () => {
      try {
        const res = await fetch(FIRESTORE_REST_DOC, { cache: 'no-store' });
        if (!res.ok) {
          console.warn('live poll failed', res.status);
          return;
        }
        const json = await res.json();
        const text = (json.fields && json.fields.text && json.fields.text.stringValue) || '';
        if (mounted) setLiveText(text);
      } catch (err) {
        console.error('live poll error', err);
      }
    };
    // initial fetch + interval
    fetchLive();
    const id = setInterval(fetchLive, 10_000);
    return () => { mounted = false; clearInterval(id); };
  }, []);

  const navigate = (target) => {
    if (typeof onNavigate === 'function') { onNavigate(target); return; }
    if (target === 'home') {
      if (menuOpen) {
        setMenuOpen(false);
        setSection(null);
        if (typeof clearOverlay === 'function') clearOverlay();
        return;
      }
      if (section === null) return;
      setIsClosing(true);
      setTimeout(() => { setSection(null); if (typeof clearOverlay === 'function') clearOverlay(); setIsClosing(false); }, FADE_MS);
      return;
    }
    if (target === section) return;
    setSection(target);
  };

  const bottomButtons = (
    <div className="bottom-buttons" role="navigation" aria-label="Site navigation">
      <button className="button-text" onClick={() => navigate('about')}>About</button>
      <button className="button-text" onClick={() => navigate('music')}>Music</button>
      <button className="button-text" onClick={() => navigate('live')}>Live</button>
    </div>
  );

  return (
    <div className="home-page">
      <div className="nav-space">
        <NavBar menuOpen={menuOpen} setMenuOpen={setMenuOpen} onLogoClick={() => navigate('home')} />
      </div>

      <img src={Hero} alt="Hero" className="hero" />

      <div className="section-frame">
        {/* Home / About (portrait) */}
        <div className={`section about ${section === 'about' && !isClosing && !isLandscapeLayout ? 'visible active' : ''}`}>
          <div className="center-block">
            <div className="container-fluid w-100">
              <div className="row align-items-start">
                <div className="col-12 col-md-4 d-flex justify-content-center">
                  <div className="about-photo-wrap">
                    <img src={BioPic} alt="Bio" className="about-photo img-fluid" />
                  </div>
                </div>
                <div className="col-12 col-md-8">
                  <div className="about-inner">
                    <h1 className="about-title">About Me</h1>
                    <hr className="about-hr" />
                    <p>I was born a melomaniac: someone who is obsessed with music. I grew up steeped in a musical family and started making up songs about the world around me for as long as my memory exists. It’s my joy to feel and speak this language and to share this unique communication with friends and strangers alike.</p>
                    <p>I was classically trained in voice and piano and picked up the ukulele and have fallen in love with this instrument and now own 10 different types of ukulele. My style is a chameleon spanning from jazz, singer-songwriter, blues, folk, pop, electronic, rock and even sea shanties.</p>
                    <p>I am available for hire for singing, playing the ukulele and singing original music and covers in a background environment and for original compositions, jingles and lyrics.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* About (landscape) */}
        <div className={`section about-landscape ${section === 'about' && !isClosing && isLandscapeLayout ? 'visible active' : ''}`}>
          <div className="center-block">
            <div className="landscape-inner">
              <div className="land-left">
                <div className="about-photo-wrap">
                  <img src={BioPic} alt="Bio" className="about-photo img-fluid" />
                </div>
              </div>
              <div className="land-right">
                <div className="about-inner">
                  <h1 className="about-title">About Me</h1>
                  <hr className="about-hr" />
                  <p>I was born a melomaniac: someone who is obsessed with music. I grew up steeped in a musical family and started making up songs about the world around me and started making up songs about the world around me for as long as my memory exists. It’s my joy to feel and speak this language and to share this unique communication with friends and strangers alike.</p>
                  <p>I was classically trained in voice and piano and picked up the ukulele and have fallen in love with this instrument and now own 10 different types of ukulele. My style is a chameleon spanning from jazz, singer-songwriter, blues, folk, pop, electronic, rock and even sea shanties.</p>
                  <p>I am available for hire for singing, playing the ukulele and singing original music and covers in a background environment and for original compositions, jingles and lyrics.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Music */}
        <div className={`section ${section === 'music' && !isClosing ? 'visible active' : ''}`}>
          <div className="center-block">
            <div className="music-section">
              <div className="player-wrap">
                <Player albumKey="all" label="All" />
              </div>
            </div>
          </div>
        </div>

        {/* Live (uses Firestore liveText) */}
        <div className={`section ${section === 'live' && !isClosing ? 'visible active' : ''}`}>
          <div className="center-block">
            <div className="live-section">
              <div className="about-inner">
                <h1 className="about-title">Live</h1>
                <hr className="about-hr" />
                <div className="live-content" dangerouslySetInnerHTML={{ __html: liveText || '<p>No events currently listed.</p>' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className={`section ${section === 'contact' && !isClosing ? 'visible active' : ''}`}>
          <div className="center-block">
            <div className="contact-section">
              <div className="contact-card" role="region" aria-label="Contact">
                <div className="contact-copy">
                  <h2 style={{margin:0, fontSize: '1.25rem'}}>Get in touch</h2>
                  <p style={{margin:'8px 0 0 0'}}>For bookings, collaborations, press, or general inquiries, send a short message. Please include any relevant dates, location, and a brief description.</p>
                </div>
                <a className="contact-link" href="mailto:kristinathekameleon@gmail.com">
                  {/* svg omitted for brevity */}
                  <span style={{marginLeft:8}}>Email Kristina</span>
                </a>
                <div className="social-icons" aria-hidden="false">
                  <span className="sr-only">Follow on social media</span>
                  <a href="https://www.facebook.com/share/19d3GYNhdK/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                    <img src={faceBookIcon} alt="Facebook" width="28" height="28" />
                  </a>
                  <a href="https://www.instagram.com/kristinadriggsmusic?igsh=NTc4MTIwNjQ2YQ==" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                    <img src={instaGramIcon} alt="Instagram" width="28" height="28" />
                  </a>
                  <a href="https://www.youtube.com/@kristinakameleon6265" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                    <img src={youTubeIcon} alt="YouTube" width="28" height="28" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* show bottom buttons for home and home overlays */}
        {(section === null || ['about','music','live','contact'].includes(section)) && bottomButtons}
              </div>
    </div>
  );
}