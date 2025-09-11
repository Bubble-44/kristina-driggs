import React from 'react';
import '../styles/breakup.scss';
import TopPhone from '../assets/top_Phone.svg';
import BottomPhone from '../assets/bottom_phone.svg';
import Player from './Player';
import { albums } from '../data/albums';
import { usePlayer } from '../context/PlayerContext';


const messages = [
    { text: "This is killing me, but I have to stop.", sent: true },
    { text: "Stop what? Don't say that.", sent: false },
    { text: "I can't keep pretending we're okay.", sent: true },
    { text: "We could be okay! If you'd just try.", sent: false },
    { text: "I have been trying! But I feel like I'm the only one. I feel so incredibly alone.", sent: true },
    { text: "That's not true. You're being dramatic.", sent: false },
    { text: "Dramatic? I'm heartbroken! And I'm angry that you can't even see it.", sent: true },
    { text: "Don't do this. Please.", sent: false },
    { text: "I wish I didn't have to. I'm so sorry.", sent: true }
];

export default function Breakup() {
    const { setAlbumKey, setAlbumIdx, setTrackIdx, setPlaying, setActivePlayerId, pushHistory } = usePlayer() || {};
    const breakupAlbum = albums[1];

    function playTrack(i) {
        setAlbumKey('breakup');
        const globalIdx = albums.findIndex(a => a.album.toLowerCase().includes('break up') || a.album.toLowerCase().includes('breakup'));
        const chosenAlbumIdx = globalIdx >= 0 ? globalIdx : 0;
        setAlbumIdx(chosenAlbumIdx);
        setTrackIdx(i);
        // log into history for Prev navigation
        pushHistory({ albumIdx: chosenAlbumIdx, trackIdx: i });
        setActivePlayerId('breakup-player');
        setPlaying(true);
    }

    return (
    <div className='breakup-container'>
        <div className="breakup-phone">
            <div className="phone-top-container">
                <img src={TopPhone} alt="Phone Top" className="phone-top" />
            </div>
            <div className="text-scroll">
                {messages.map((msg, i) => (
                    <div key={i} className={`text-bubble${msg.sent ? ' sent' : ''}`}>{msg.text}</div>
                ))}
                <div className="song-buttons">
                    {breakupAlbum.tracks.map((t, i) => (
                        <button key={i} className="btn btn-outline-dark" onClick={() => playTrack(i)}>{t.title}</button>
                    ))}
                </div>
                <div className="breakup-player-wrapper">
                    <Player id="breakup-player" albumKey="breakup" label="Breakup" />
                </div>
            </div>
            <div className="phone-bottom-container">
                <img src={BottomPhone} alt="Phone Bottom" className="phone-bottom" />
            </div>
        </div>
    </div>
    );
}