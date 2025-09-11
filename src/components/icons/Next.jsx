import React from 'react';

export default function NextIcon({ className, width = 20, height = 20 }) {
    return (
        <svg className={className} width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M18 6V18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M6 6L15 12L6 18V6Z" fill="currentColor" />
        </svg>
    );
}
