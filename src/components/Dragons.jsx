import React from 'react';
import '../styles/player.scss';
import Dragons1920 from '../assets/Drogons1920.mp4';
import Player from './Player';
import { albums } from '../data/albums';
import { usePlayer } from '../context/PlayerContext';
import '../styles/dragons.scss';


// this Player will render inside the Dragons section but use shared context to sync


export default function Dragons() {
  const { setAlbumKey, setAlbumIdx, setTrackIdx, setPlaying, setActivePlayerId, pushHistory } = usePlayer() || {};
  const dragonsAlbum = albums[2];

  // Dragons layout: use local CSS classes (no Bootstrap utilities)

  function playTrack(i) {
      setAlbumKey('dragons');
      // find global album index for Dragons
      const globalIdx = albums.findIndex(a => a.album.toLowerCase().includes('dragons'));
      const chosenAlbumIdx = globalIdx >= 0 ? globalIdx : 0;
      setAlbumIdx(chosenAlbumIdx);
      setTrackIdx(i);
      pushHistory({ albumIdx: chosenAlbumIdx, trackIdx: i });
      setActivePlayerId('dragons-player');
      setPlaying(true);
  }

  return (
    <section className="dragons-section">
      <video className="dragons-hero" src={Dragons1920} autoPlay loop muted playsInline />
      <div className="dragons-frame">
        <div className="dragons-backdrop">
          <div className="song-buttons">
            {dragonsAlbum.tracks.map((t, i) => (
              <button key={i} className="btn song-btn" onClick={() => playTrack(i)}>{t.title}</button>
            ))}
          </div>
          <Player id="dragons-player" albumKey="dragons" label="Dragons" />
        </div>
      </div>
      <div className="dragons-center">
        <div className='dragonstext'>
          <h2>Here</h2>
          <h2>Be</h2>
          <h2>Dragons</h2>
        </div>
      </div>
    </section>
  );
}

