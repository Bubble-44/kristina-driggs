import React, { useRef, useState, useEffect, useContext } from 'react';
import ShuffleIcon from './icons/Shuffle';
import PrevIcon from './icons/Prev';
import PlayIcon from './icons/Play';
import PauseIcon from './icons/Pause';
import NextIcon from './icons/Next';
import { albums } from '../data/albums';
import { usePlayer } from '../context/PlayerContext';
import { formatTime } from '../data/albums';
import '../styles/player.scss';
import debutCover from '../assets/debutCover.png';

export default function Player({
    id,
    albumKey: albumKeyProp,
    albumIdx: albumIdxProp,
    trackIdx: trackIdxProp,
    playing: playingProp,
    setAlbumIdx: setAlbumIdxProp,
    setTrackIdx: setTrackIdxProp,
    setPlaying: setPlayingProp,
    label,
    landscape
}) {
    // context fallback
    const ctx = usePlayer();

    const instanceIdRef = useRef(id || `player_${Math.random().toString(36).slice(2, 9)}`);
    const instanceId = instanceIdRef.current;

    // resolve props or context values
    const albumIdx = typeof albumIdxProp === 'number' ? albumIdxProp : (ctx ? ctx.albumIdx : 0);
    const trackIdx = typeof trackIdxProp === 'number' ? trackIdxProp : (ctx ? ctx.trackIdx : 0);
    const playing = typeof playingProp === 'boolean' ? playingProp : (ctx ? ctx.playing : false);

    // ...existing code...
    const setAlbumIdx = setAlbumIdxProp || (ctx && ctx.setAlbumIdx) || (() => {});
    const setTrackIdx = setTrackIdxProp || (ctx && ctx.setTrackIdx) || (() => {});
    const setPlaying = setPlayingProp || (ctx && ctx.setPlaying) || (() => {});
    const activePlayerId = ctx ? ctx.activePlayerId : null;
    const setActivePlayerId = ctx ? ctx.setActivePlayerId : (() => {});
    const currentTimeCtx = ctx ? ctx.currentTime : 0;
    const setCurrentTime = ctx ? ctx.setCurrentTime : (() => {});
    const durationCtx = ctx ? ctx.duration : 0;
    const setDuration = ctx ? ctx.setDuration : (() => {});
    const pushHistory = ctx ? ctx.pushHistory : (() => {});
    const goBackHistory = ctx ? ctx.goBackHistory : (() => null);

    const audioRef = useRef(null);

        // determine album by index or by provided albumKey prop
        let displayAlbum = null;
        if (typeof albumIdx === 'number' && albums[albumIdx]) displayAlbum = albums[albumIdx];
        else if (albumKeyProp) {
            displayAlbum = albums.find(a => a.album.toLowerCase().includes(albumKeyProp)) || null;
        }
    const displayTrack = (displayAlbum && typeof trackIdx === 'number' && displayAlbum.tracks[trackIdx]) ? displayAlbum.tracks[trackIdx] : null;
    // Show cover only for Home/global player (albumKey "all")
    const showCover = albumKeyProp && typeof albumKeyProp === 'string' && albumKeyProp.toLowerCase().includes('all');

    // local timeline if context not present
    const [localCurrentTime, setLocalCurrentTime] = useState(0);
    const [localDuration, setLocalDuration] = useState(0);

    const currentTime = ctx ? currentTimeCtx : localCurrentTime;
    const duration = ctx ? durationCtx : localDuration;

    const activateThisPlayer = () => {
        if (setActivePlayerId) setActivePlayerId(instanceId);
    };

    const playPause = () => {
            activateThisPlayer();
            // if no track selected for this player instance, choose the first track of this player's album
            if (!displayTrack) {
                // try to select using albumKeyProp first, then albumIdx, otherwise pick first album
                let targetAlbumIdx = 0;
                if (albumKeyProp) {
                    const found = albums.findIndex(a => a.album.toLowerCase().includes(albumKeyProp));
                    if (found >= 0) targetAlbumIdx = found;
                } else if (typeof albumIdx === 'number') targetAlbumIdx = albumIdx;
                setAlbumIdx(targetAlbumIdx);
                setTrackIdx(0);
                // record to history
                pushHistory({ albumIdx: targetAlbumIdx, trackIdx: 0 });
                setPlaying(true);
                return;
            }

            setPlaying(!playing);
    };

    const prevTrack = () => {
        activateThisPlayer();
        // if we have a history, go back through it first
        const prev = goBackHistory();
        if (prev) {
            setAlbumIdx(prev.albumIdx);
            setTrackIdx(prev.trackIdx);
            setPlaying(true);
            setCurrentTime(0);
            return;
        }
        let newAlbumIdx = typeof albumIdx === 'number' ? albumIdx : 0;
        let newTrackIdx = typeof trackIdx === 'number' ? trackIdx : 0;
        if (trackIdx > 0) {
            newTrackIdx = trackIdx - 1;
        } else if (albumIdx > 0) {
            newAlbumIdx = albumIdx - 1;
            newTrackIdx = albums[newAlbumIdx].tracks.length - 1;
        } else {
            // wrap to last
            newAlbumIdx = albums.length - 1;
            newTrackIdx = albums[newAlbumIdx].tracks.length - 1;
        }
        setAlbumIdx(newAlbumIdx);
        setTrackIdx(newTrackIdx);
        // record to history for the navigated-to track
        pushHistory({ albumIdx: newAlbumIdx, trackIdx: newTrackIdx });
        setPlaying(true);
        setCurrentTime(0);
    };

    const nextTrack = () => {
        activateThisPlayer();
        // Special-case Home player (albumKey "all"):
        // Advance through a flattened list of all tracks (sequential next in the global list)
        if (albumKeyProp && typeof albumKeyProp === 'string' && albumKeyProp.toLowerCase().includes('all')) {
            // build flattened list of { albumIdx, trackIdx }
            const flat = [];
            albums.forEach((a, ai) => a.tracks.forEach((_, ti) => flat.push({ albumIdx: ai, trackIdx: ti })));
            if (flat.length === 0) return;
            // find current position in flat list
            const curIdx = flat.findIndex(x => typeof albumIdx === 'number' && x.albumIdx === albumIdx && x.trackIdx === trackIdx);
            const nextFlatIdx = (curIdx >= 0 ? curIdx + 1 : 0) % flat.length;
            const next = flat[nextFlatIdx];
            setAlbumIdx(next.albumIdx);
            setTrackIdx(next.trackIdx);
            pushHistory({ albumIdx: next.albumIdx, trackIdx: next.trackIdx });
            setPlaying(true);
            setCurrentTime(0);
            return;
        }
        // Determine this Player's own album (prefer explicit props / albumKeyProp)
        let ownerAlbumIdx = null;
        if (albumKeyProp) {
            const found = albums.findIndex(a => a.album.toLowerCase().includes(albumKeyProp));
            if (found >= 0) ownerAlbumIdx = found;
        }
        if (ownerAlbumIdx === null && typeof albumIdxProp === 'number') ownerAlbumIdx = albumIdxProp;
        if (ownerAlbumIdx === null && typeof albumIdx === 'number') ownerAlbumIdx = albumIdx;

        // fallback to first album if nothing resolved
        if (ownerAlbumIdx === null || !albums[ownerAlbumIdx]) ownerAlbumIdx = 0;

        const ownerAlbum = albums[ownerAlbumIdx];
        // determine current track index within the owner's album; if current global album differs, start from -1 so next becomes 0
        const currentIndexInOwner = (typeof albumIdx === 'number' && albumIdx === ownerAlbumIdx) ? trackIdx : -1;
        let newTrackIdx;
        if (currentIndexInOwner >= 0) {
            // advance within the owner's album
            newTrackIdx = (currentIndexInOwner + 1) % ownerAlbum.tracks.length;
        } else {
            // not currently on owner's album — start at first track
            newTrackIdx = 0;
        }

        setAlbumIdx(ownerAlbumIdx);
        setTrackIdx(newTrackIdx);
        // push into history
        pushHistory({ albumIdx: ownerAlbumIdx, trackIdx: newTrackIdx });
        setPlaying(true);
        setCurrentTime(0);
    };

    const playRandom = () => {
        // stop any audio playing elsewhere immediately
        try {
            const audios = Array.from(document.querySelectorAll('audio'));
            audios.forEach(a => { try { a.pause(); } catch(e){} });
        } catch (e) {}

        // make this player active
        activateThisPlayer();
        // If this Player has a specific album (section), shuffle within that album.
        let randAlbumIdx;
        let randTrackIdx;
        // prefer explicit albumKeyProp (player's section), then albumIdxProp, then context albumIdx
        // Special-case: if albumKeyProp indicates the Home/global player ("all"), treat as global shuffle
        let targetAlbumIdx = null;
        if (albumKeyProp && typeof albumKeyProp === 'string' && albumKeyProp.toLowerCase().includes('all')) {
            // leave targetAlbumIdx as null to trigger global shuffle
        } else if (albumKeyProp) {
            const found = albums.findIndex(a => a.album.toLowerCase().includes(albumKeyProp));
            if (found >= 0) targetAlbumIdx = found;
        }
        if (targetAlbumIdx === null && typeof albumIdxProp === 'number') targetAlbumIdx = albumIdxProp;
        if (targetAlbumIdx === null && typeof albumIdx === 'number') targetAlbumIdx = albumIdx;

        if (targetAlbumIdx !== null && albums[targetAlbumIdx]) {
            randAlbumIdx = targetAlbumIdx;
            randTrackIdx = Math.floor(Math.random() * albums[randAlbumIdx].tracks.length);
        } else {
            // global shuffle across all albums
            randAlbumIdx = Math.floor(Math.random() * albums.length);
            randTrackIdx = Math.floor(Math.random() * albums[randAlbumIdx].tracks.length);
        }
        setAlbumIdx(randAlbumIdx);
        setTrackIdx(randTrackIdx);
        pushHistory({ albumIdx: randAlbumIdx, trackIdx: randTrackIdx });
        setPlaying(true);
        setCurrentTime(0);
    };

    const onTimeUpdate = () => {
        if (!audioRef.current) return;
        const t = audioRef.current.currentTime;
        if (ctx && ctx.setCurrentTime) ctx.setCurrentTime(t);
        else setLocalCurrentTime(t);
    };

    const onLoadedMetadata = () => {
        if (!audioRef.current) return;
        const d = audioRef.current.duration || 0;
        if (ctx && ctx.setDuration) ctx.setDuration(d);
        else setLocalDuration(d);
    };

    const seek = (e) => {
        if (!audioRef.current) return;
        // allow clicks on progress container or its child
        const target = e.currentTarget;
        const rect = target.getBoundingClientRect();
        const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        const newTime = percent * (duration || 0);
        audioRef.current.currentTime = newTime;
        if (ctx && ctx.setCurrentTime) ctx.setCurrentTime(newTime);
        else setLocalCurrentTime(newTime);
    };

    // load new track when album/track changes
    useEffect(() => {
        if (!audioRef.current) return;
        // update src and load
        audioRef.current.load();
        // only auto-play if this instance is the active player
        if (playing && activePlayerId === instanceId) {
            const p = audioRef.current.play();
            if (p && p.catch) p.catch(() => {});
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [albumIdx, trackIdx, activePlayerId]);

    useEffect(() => {
        if (!audioRef.current) return;
        if (activePlayerId === instanceId) {
            if (playing) audioRef.current.play().catch(() => {});
            else audioRef.current.pause();
        } else {
            audioRef.current.pause();
        }
    }, [playing, activePlayerId]);

    return (
        <div className="player-container">
            <audio
                ref={audioRef}
                src={displayTrack ? displayTrack.audio : undefined}
                onTimeUpdate={onTimeUpdate}
                onLoadedMetadata={onLoadedMetadata}
                onEnded={nextTrack}
            />

            <div className={`player-ui ${showCover ? 'player-ui--cover-top' : ''} player-ui--meta-top`}>
                {/* Primary cover (square) */}
                {showCover && (
                    <img className="player-cover" src={displayAlbum?.image || debutCover} alt={displayAlbum?.album || 'Album cover'} />
                )}

          

                <div className="player-meta">
                          {/* Landscape cover (optional) - use fallback so src never becomes undefined */}
                {showCover && (
                    <img
                        className="player-cover player-cover--landscape"
                        src={landscape || displayAlbum?.image || debutCover}
                        alt={`${displayAlbum?.album || 'Album'} landscape`}
                        data-landscape-provided={!!landscape}
                    />
                )}
                    <div className="album"><span className="meta-label">Album:</span> <span className="meta-value">{displayAlbum ? displayAlbum.album : ''}</span></div>
                    <div className="track"><span className="meta-label">Track:</span> <span className="meta-value">{displayTrack ? displayTrack.title : ''}</span></div>
                </div>

                <div className="player-center">
                    <div className="controls">
                        <button className="control" onClick={prevTrack} aria-label="Previous"><PrevIcon /></button>
                        <button className="control" onClick={playPause} aria-label="Play or Pause">{playing ? <PauseIcon /> : <PlayIcon />}</button>
                        <button className="control" onClick={nextTrack} aria-label="Next"><NextIcon /></button>
                        <button className="control" onClick={playRandom} aria-label="Shuffle"><ShuffleIcon /></button>
                    </div>

                    <div className="progress" onClick={seek} role="progressbar" aria-valuemin={0} aria-valuemax={duration || 0} aria-valuenow={currentTime || 0}>
                        <div className="progress-bar" style={{ width: `${(duration ? (currentTime / duration) : 0) * 100}%` }} />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                        <div className="time">{formatTime(currentTime || 0)}</div>
                        <div className="time">{formatTime(duration || 0)}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

