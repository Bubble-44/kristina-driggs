import 'bootstrap/dist/css/bootstrap.min.css';
import './App.scss';
import Debut from './components/Debut';
import Breakup from './components/Breakup';
import Home from './components/Home';
import Dragons from './components/Dragons';
import DropDownMenu from './components/DropDownMenu';
import { PlayerProvider } from './context/PlayerContext';

import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminLive from './AdminLive';
import { setTheme, initTheme } from './data/theme';

// Stable MainApp component (defined once, outside App)
function MainApp({
  menuOpen,
  setMenuOpen,
  overlayActive,
  overlayClosing,
  setOverlayActive,
  handleNavigate,
  homeSection,
}) {
  return (
    <div>
      <DropDownMenu open={menuOpen} onNavigate={handleNavigate} />

      <PlayerProvider>
        <Home
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
          externalSection={homeSection}
          clearOverlay={() => setOverlayActive(null)}
          onNavigate={handleNavigate}
        />

        <div className={`section ${(overlayActive === 'dragons' && !overlayClosing) ? 'visible active' : ''}`}>
          <Dragons />
        </div>

        <div className={`section ${(overlayActive === 'debut' && !overlayClosing) ? 'visible active' : ''}`}>
          <Debut />
        </div>

        <div className={`section ${(overlayActive === 'breakup' && !overlayClosing) ? 'visible active' : ''}`}>
          <Breakup />
        </div>
      </PlayerProvider>
    </div>
  );
}

function App() {
  // Dropdown menu state
  const [menuOpen, setMenuOpen] = useState(false);

  // overlay state for frames rendered above Home (null = baseline hero visible)
  const [overlayActive, setOverlayActive] = useState(null); // 'dragons' | 'debut' | 'breakup' | null
  const [overlayClosing, setOverlayClosing] = useState(false);
  const SECTION_FADE = 420;

  // Home internal section state (null = baseline)
  const [homeSection, setHomeSection] = useState(null); // 'about' | 'music' | 'live' | 'contact' | null

  const themeTimer = useRef(null);

  useEffect(() => {
    initTheme(); // ensure defaults applied at load
    return () => {
      if (themeTimer.current) clearTimeout(themeTimer.current);
    };
  }, []);

  const scheduleTheme = (name) => {
    if (themeTimer.current) clearTimeout(themeTimer.current);
    themeTimer.current = setTimeout(() => {
      setTheme(name);
      themeTimer.current = null;
    }, 900); 
  };

  // unified navigation handler used by the DropDownMenu (single declaration)
  const handleNavigate = (target) => {
    const overlayTargets = ['dragons', 'debut', 'breakup'];

    // overlay navigation logic (theme change scheduled after menu close)
    if (overlayTargets.includes(target)) {
      if (target === overlayActive) return;
      if (overlayActive !== null) {
        setOverlayClosing(true);
        setTimeout(() => {
          setOverlayActive(target);
          setOverlayClosing(false);
          setMenuOpen(false);
          scheduleTheme(target);
        }, SECTION_FADE);
        return;
      }
      setOverlayActive(target);
      setTimeout(() => {
        setMenuOpen(false);
        scheduleTheme(target);
      }, SECTION_FADE);
      return;
    }

    if (overlayActive !== null) {
      setOverlayClosing(true);
      setTimeout(() => {
        setOverlayActive(null);
        setOverlayClosing(false);
        if (target === 'home') setHomeSection(null);
        else setHomeSection(target);
        setMenuOpen(false);
        scheduleTheme('default');
      }, SECTION_FADE);
      return;
    }

    if (target === 'home') setHomeSection(null);
    else setHomeSection(target);
    setTimeout(() => {
      setMenuOpen(false);
      scheduleTheme('default');
    }, SECTION_FADE);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <MainApp
              menuOpen={menuOpen}
              setMenuOpen={setMenuOpen}
              overlayActive={overlayActive}
              overlayClosing={overlayClosing}
              setOverlayActive={setOverlayActive}
              handleNavigate={handleNavigate}
              homeSection={homeSection}
            />
          }
        />
        <Route path="/admin" element={<AdminLive />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
