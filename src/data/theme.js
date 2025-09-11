const THEMES = {
  default: {
    brandColor: '#e1cec0',
    toggleBackground: 'rgba(255, 255, 255, 0.34)', 
    gradient1: 'rgba(0,0,0,0.10)',
    gradient2: 'rgba(0,0,0,0.90)',
  },
  dragons: {
    brandColor: '#097337',
    toggleBackground: 'rgba(255, 255, 255, 0.34)',
    gradient1: 'rgba(201, 231, 242, 0.60)',
    gradient2: 'rgba(201, 231, 242, 0.90)',
  },
  debut: {
    brandColor: '#bdbdbd',
    toggleBackground: 'rgba(65, 65, 65, 0.7)',
    gradient1: 'hsla(0, 0.00%, 0.00%, 0.20)',
    gradient2: 'hsla(0, 0.00%, 0.00%, 0.90)',
  },
  breakup: {
    brandColor: '#4c84c4',
    toggleBackground: 'rgba(255, 255, 255, 0.70)',
    gradient1: 'rgb(221, 235, 212, 0.4)',
    gradient2: 'rgb(221, 235, 212, 0.8)',
  }
};

function applyTheme(theme) {
  const root = document.documentElement.style;
  root.setProperty('--brand-color', theme.brandColor);
  root.setProperty('--toggle-background', theme.toggleBackground);
  root.setProperty('--drop-down-menu-background-gradient-1', theme.gradient1);
  root.setProperty('--drop-down-menu-background-gradient-2', theme.gradient2);
}

export function setTheme(name) {
  const t = THEMES[name] || THEMES.default;
  applyTheme(t);
}

export function initTheme() {
  applyTheme(THEMES.default);
}
