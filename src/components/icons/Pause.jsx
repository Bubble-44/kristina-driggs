import React from 'react';

export default function PauseIcon({ className, width = 20, height = 20 }) {
    return (
        <svg className={className} width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M6 5h4v14H6zM14 5h4v14h-4z" fill="currentColor" />
        </svg>
    );
}
