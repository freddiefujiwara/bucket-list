import { createApp } from 'vue';
import App from './App.vue';
import './style.css';
import { THEME_KEY, resolveTheme } from './utils/theme';

// Apply the stored theme before mounting so the first paint already
// uses the right color scheme (dark by default, as on ga/health).
if (resolveTheme(localStorage.getItem(THEME_KEY)) === 'light') {
  document.documentElement.setAttribute('data-theme', 'light');
}

createApp(App).mount('#app');
