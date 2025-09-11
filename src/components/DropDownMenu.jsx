import React, { useEffect, useState } from 'react';
import faceBookIcon from '../assets/faceBookIcon.svg';
import instaGramIcon from '../assets/instaGramIcon.svg';
import youTubeIcon from '../assets/youTubeIcon.svg';
import '../styles/dropdownmenu.scss';



// Dummy SVG music icon
const MusicIcon = () => (
	<svg className="music-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg>
);


// Main DropDownMenu component
export default function DropDownMenu({ open, onNavigate }) {
	// internal state to sequence animations: expand height first, then fade in content
	const [openInternal, setOpenInternal] = useState(false);
	const [contentVisible, setContentVisible] = useState(false);

	// timings must match CSS transitions
	const HEIGHT_DURATION = 520; // ms (matches .custom-dropdown-menu transition)
	const CONTENT_FADE = 300; // ms

	useEffect(() => {
		let t1, t2;
		if (open) {
			// start expanding menu
			setOpenInternal(true);
			// after height expansion, fade content in
			t1 = setTimeout(() => setContentVisible(true), HEIGHT_DURATION);
		} else {
			// fade content out first, then collapse height
			setContentVisible(false);
			t2 = setTimeout(() => setOpenInternal(false), CONTENT_FADE);
		}
		return () => {
			clearTimeout(t1);
			clearTimeout(t2);
		};
	}, [open]);

	return (
		<div className={`custom-dropdown-menu${openInternal ? ' open' : ''}`}>
			<div className={`menu-content${contentVisible ? ' visible' : ''}`}>
				<div className="menu-buttons">
					<button className="menu-button" onClick={() => onNavigate && onNavigate('home')}>Home</button>
					<button className="menu-button" onClick={() => onNavigate && onNavigate('about')}>About Me</button>
					<button className="menu-button" onClick={() => onNavigate && onNavigate('live')}>Live</button>
					<div className="menu-albums">
						<div className="music-label">
							<div>M</div>
							<div>U</div>
							<div>S</div>
							<div>I</div>
							<div>C</div>
						</div>
						<div className="album-separator"></div>
						<div className="album-list">
							<button className="menu-button album" onClick={() => onNavigate && onNavigate('dragons')}>Here be Dragons</button>
							<button className="menu-button album" onClick={() => onNavigate && onNavigate('debut')}>Eponymous Debut</button>
							<button className="menu-button album" onClick={() => onNavigate && onNavigate('breakup')}>Obligatory Break up Album</button>
						</div>
					</div>
					<button className="menu-button" onClick={() => onNavigate && onNavigate('contact')}>Contact</button>
				</div>
				<div className="social-icons">
					<div className="social-icons" >
						<a href="https://www.facebook.com/share/19d3GYNhdK/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
							<svg id="Layer_2" data-name="Layer 2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 102.062 101.921">
								<defs>

								</defs>
								<g id="Layer_1-2" data-name="Layer 1">
									<path class="home-social-icon" d="M58.971,101.921v-35.875h11.958l2.308-14.895h-14.266v-10.595c0-4.089,4.028-7.028,7.867-7.028h7.028v-12.588c-1.989-.208-3.988-.669-5.981-.837-7.37-.622-16.462.286-21.169,6.729-5.123,7.013-3.383,16.172-3.69,24.318h-13.007v14.895h13.007v35.875c-3.461-.564-6.895-1.518-10.179-2.724C-14.185,81.938-9.591,12.134,39.458,1.322c36.138-7.966,67.068,21.183,62.072,57.666-3.087,22.542-20.266,39.346-42.559,42.933Z" />
								</g>
							</svg>
						</a>
						<a href="https://www.instagram.com/kristinadriggsmusic?igsh=NTc4MTIwNjQ2YQ==" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
							<svg id="Layer_2" data-name="Layer 2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 102.013 101.921">
								<defs>

								</defs>
								<g id="Layer_1-2" data-name="Layer 1">
									<path class="home-social-icon" d="M47.443.134C9.023,2.844-12.827,46.124,8.133,78.634c20.84,32.33,69.42,30.73,87.67-3.14C114.883,40.084,87.523-2.706,47.443.134ZM83.063,66.754c-.76,10.92-6.73,17.04-17.74,17.75-7.09.46-27.25.91-33.39-.66-11.33-2.89-12.48-12.61-12.91-22.59-.32-7.45-.74-25.98,2.44-32.11,5.51-10.65,16.79-7.44,26.5-8.54l3.81.4c10.79.4,24.48-3.05,29.66,9.34,2.47,5.91,2.14,29.1,1.63,36.41Z" />
									<path class="home-social-icon" d="M56.563,43.754c-9.95-6.14-20.87,6.04-13.57,15.58,3.38,4.4,10.57,5.11,14.83,1.58,5.46-4.53,4.83-13.4-1.26-17.16ZM56.563,43.754c-9.95-6.14-20.87,6.04-13.57,15.58,3.38,4.4,10.57,5.11,14.83,1.58,5.46-4.53,4.83-13.4-1.26-17.16ZM77.023,49.254c-.12-10.18,2.26-21.14-11.28-22.72-6.44-.75-22.91-.73-29.32.08-5.69.71-10.39,4.33-11.25,10.25-.92,6.36-.78,23.76-.12,30.36.94,9.58,7.39,11.32,15.72,11.78,7.76.42,18.87.41,26.52-.52,5.19-.63,9.11-4.67,9.7-9.81.66-5.76.1-13.59.03-19.42ZM55.023,68.864c-22.27,5.53-28.92-29.95-6.14-32.64,21.16-2.5,25.74,27.77,6.14,32.64ZM67.303,37.514c-4.47-.17-4.91-6.53-.9-7.44,6.15-1.38,6.83,7.67.9,7.44ZM56.563,43.754c-9.95-6.14-20.87,6.04-13.57,15.58,3.38,4.4,10.57,5.11,14.83,1.58,5.46-4.53,4.83-13.4-1.26-17.16Z" />
								</g>
							</svg>
						</a>
						<a href="https://www.youtube.com/@kristinakameleon6265" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
							<svg id="Layer_2" data-name="Layer 2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 102.06 101.921">
								<defs>

								</defs>
								<g id="Layer_1-2" data-name="Layer 1">
									<path class="home-social-icon" d="M47.914.094C10.285,2.316-12.148,43.849,6.945,76.62c19.306,33.138,67.138,33.892,87.373,1.274C116.14,42.713,89.033-2.332,47.914.094ZM86.474,68.418c-2.416,8.157-11.769,7.182-18.639,7.455-11.306.448-22.527.459-33.835-.01-7.251-.3-16.264.732-18.564-7.938-1.975-7.451-1.774-22.541-.681-30.249,1.547-10.907,6.668-10.972,16.384-11.545,4.271-.253,8.621-.277,12.9-.351,10.617-.177,23.552-.461,33.984.962,7.286.995,8.782,6.059,9.457,12.56.779,7.5,1.095,22.029-1.007,29.116Z" />
									<path class="home-social-icon" d="M67.528,44.757l-22.943-13.246c-4.665-2.693-10.496.673-10.496,6.06v26.492c0,5.387,5.831,8.754,10.496,6.06l22.943-13.246c4.665-2.693,4.665-9.427,0-12.12Z" />
								</g>
							</svg>
						</a>
					</div>

				</div>
			</div>
		</div>
	);
}