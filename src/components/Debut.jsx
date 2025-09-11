import React from 'react';
import '../styles/debut.scss';
import Eponymous1920 from '../assets/Eponymous1920.mp4';
import Player from './Player';
import { albums } from '../data/albums';
import { usePlayer } from '../context/PlayerContext';


export default function Debut() {
  const { setAlbumKey, setAlbumIdx, setTrackIdx, setPlaying, setActivePlayerId, pushHistory } = usePlayer() || {};
  const debutAlbum = albums[0];

  function playTrack(i) {
    setAlbumKey('debut');
    const globalIdx = albums.findIndex(a => a.album.toLowerCase().includes('debut'));
    const chosenAlbumIdx = globalIdx >= 0 ? globalIdx : 0;
    setAlbumIdx(chosenAlbumIdx);
    setTrackIdx(i);
    pushHistory({ albumIdx: chosenAlbumIdx, trackIdx: i });
    setActivePlayerId('debut-player');
    setPlaying(true);
  }

  // ...existing code...
  return (
    <section className="debut-section">
      <video
        className="debut-hero"
        src={Eponymous1920}
        autoPlay
        loop
        muted
        playsInline
      />
      <div className='debut-button-wraper'>
        <div className="debut-song-buttons">
          <div className="song-buttons">
            {debutAlbum.tracks.map((t, i) => (
              <button key={i} className="btn song-btn" onClick={() => playTrack(i)}>{t.title}</button>
            ))}
          </div>
        </div>
      </div>
      <div className='debut-player-wrapper'>

        <Player id="debut-player" albumKey="debut" label="Debut" />
      </div>



      <div className='debut-player-wrapper-landscape'>
        <div className="debut-song-buttons-landscape">

          <div className="song-buttons">
            {debutAlbum.tracks.map((t, i) => (
              <button key={i} className="btn song-btn" onClick={() => playTrack(i)}>{t.title}</button>
            ))}        
            <Player id="debut-player" albumKey="debut" label="Debut" />

          </div>
        </div>


      </div>




    </section>
  );
}