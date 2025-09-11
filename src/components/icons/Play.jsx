import React from 'react';

export default function PlayIcon({ className, width = 20, height = 20 }) {
    return (
        <svg className={className} width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M8 5v14l11-7L8 5Z" fill="currentColor" />
        </svg>
    );
}
