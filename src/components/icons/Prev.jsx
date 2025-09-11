import React from 'react';

export default function PrevIcon({ className, width = 20, height = 20 }) {
    return (
        <svg className={className} width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M6 6v12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M18 6L9 12L18 18V6Z" fill="currentColor" />
        </svg>
    );
}
