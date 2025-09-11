import gloomyTune from '../assets/audio/Gloomy Tune_01.mp3';
import loveMerryGoRound from '../assets/audio/Love Merry Go Round_01.mp3';
import wavesOfMemory from '../assets/audio/Waves Of Memory_01.mp3';
import boringLoveSong from '../assets/audio/Boring Love Song_01.mp3';
import bestFriends from '../assets/audio/Best Friends_01.mp3';
import singTheBlues from '../assets/audio/sing_the_blues.mp3';
import coldHeartedWoman from '../assets/audio/Cold Hearted Woman_01.mp3';
import hereBeDragons from '../assets/audio/Here Be Dragons_01.mp3';
import seaShantyBlues from '../assets/audio/Sea Shanty Blues_01.mp3';
import aMermaidsTale from '../assets/audio/A Mermaids Tale_01.mp3';
import carryMyLoveOverTheSea from '../assets/audio/Carry My Love Over The Sea_01.mp3';
import aSelfieSong from '../assets/audio/A Selfie Song_01.mp3';
import someoneToLoveMe from '../assets/audio/Someone to Love Me_01.mp3';
import musicBox from '../assets/audio/Music Box_01.mp3';
import circusCalledLife from '../assets/audio/Circus Called Life_01.mp3';
import breakUpCover from '../assets/breakUpCover.png';
import debutCover from '../assets/debutCover.png';
import dragonsCover from '../assets/dragonsCover.png';
import extraCover from '../assets/extraCover.png';

export const albums = [
    {
        album: "Eponymous Debut",
        image: debutCover,
        tracks: [
            { title: "Gloomy Tune", audio: gloomyTune },
            { title: "Love Merry Go Round", audio: loveMerryGoRound },
            { title: "Waves Of Memory", audio: wavesOfMemory },
            { title: "Boring Love Song", audio: boringLoveSong },
            { title: "Best Friends", audio: bestFriends }
        ]
    },
    {
        album: "Obligatory Break Up Album",
        image: breakUpCover,
        tracks: [
            { title: "Sing The Blues", audio: singTheBlues },
            { title: "Cold Hearted Woman", audio: coldHeartedWoman }
        ]
    },
    {
        album: "Here be Dragons",
        image: dragonsCover,
        tracks: [
            { title: "Here Be Dragons", audio: hereBeDragons },
            { title: "Sea Shanty Blues", audio: seaShantyBlues },
            { title: "A Mermaids Tale", audio: aMermaidsTale },
            { title: "Carry My Love Over The Sea", audio: carryMyLoveOverTheSea }
        ]
    },
    {
        album: "Extra",
        image: extraCover,
        tracks: [
            { title: "A Selfie Song", audio: aSelfieSong },
            { title: "Someone to Love Me", audio: someoneToLoveMe },
            { title: "Music Box", audio: musicBox },
            { title: "Circus Called Life", audio: circusCalledLife }
        ]
    }
];

export function formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
}
