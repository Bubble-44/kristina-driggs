import React from 'react';

export default function ShuffleIcon({ className, width = 20, height = 20 }) {
    return (
        <svg className={className} width={width} height={height} viewBox="0 0 57.1 38.9" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path fill="currentColor" d="M7,28.5c8.4-1.1,12.9-11.2,18.2-16.9,5.1-5.5,10.9-8,18.4-8.4L43.9,0l13.2,6.9-12.8,6.9c-.8.3-.3-1.9-.5-2.5-.3-1.1-2.5-.6-3.4-.5-7.9,1.6-13.6,15.2-20.3,20-3,2.2-8.7,4.8-12.4,4.8H.2v-7.1c2.2-.2,4.8.3,6.9,0Z" />
            <path fill="currentColor" d="M43.4,28.5l.5-3.3,13.1,6.6c0,.5-.4.6-.7.8-2.4,1.6-8.9,4.8-11.7,5.8s-.6.3-1,.2v-2.9c-6.6-.4-13.4-2.5-17.4-7.7l5.1-6.6c3,3.8,6.9,7.3,12.1,7h0Z" />
            <path fill="currentColor" d="M0,3.3c8.4-.4,16.5,1,22.7,7.1.3.2,0,.4,0,.6-.9,1.9-3.9,4.4-4.9,6.5-1.8-1.5-3.2-3.6-5.3-4.9s-4.8-2.2-6.7-2.2H.1V3.3h-.1Z" />
        </svg>
    );
}
