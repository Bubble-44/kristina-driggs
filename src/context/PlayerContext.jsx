import React, { createContext, useContext, useState } from 'react';
import { albums } from '../data/albums';

const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {
  // no selection by default — wait for user action
  const [albumKey, setAlbumKey] = useState(null);
  const [albumIdx, setAlbumIdx] = useState(null);
  const [trackIdx, setTrackIdx] = useState(null);
  const [playing, setPlaying] = useState(false);
  // which Player instance is currently active (should be the id of the Player that the user interacted with)
  const [activePlayerId, setActivePlayerId] = useState(null);
  // shared timeline state so all Player instances display the same playhead
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  // history of played tracks (each entry { albumIdx, trackIdx })
  const [history, setHistory] = useState([]);

  // (shuffle removed — Player now uses playRandom for shuffle behavior)

  const pushHistory = (entry) => {
    if (!entry || typeof entry.albumIdx !== 'number' || typeof entry.trackIdx !== 'number') return;
    setHistory(h => {
      const last = h[h.length - 1];
      if (last && last.albumIdx === entry.albumIdx && last.trackIdx === entry.trackIdx) return h;
      return [...h, entry];
    });
  };

  const goBackHistory = () => {
    // return the previous entry (one before the last) and trim the history by popping the last entry
    if (history.length < 2) return null;
    const prev = history[history.length - 2];
    setHistory(h => h.slice(0, -1));
    return prev;
  };

  return (
    <PlayerContext.Provider
      value={{
  albumKey,
        setAlbumKey,
        albumIdx,
        setAlbumIdx,
        trackIdx,
        setTrackIdx,
        playing,
        setPlaying,
        activePlayerId,
        setActivePlayerId
  ,
  currentTime,
  setCurrentTime,
  duration,
  setDuration
  ,
  history,
  pushHistory,
  goBackHistory
  
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  return useContext(PlayerContext);
}
