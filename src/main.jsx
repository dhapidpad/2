import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css';

// Nạp sẵn các độ đậm của font để không bị "nhảy chữ"/đổi bố cục giữa lúc đang chuyển slide
if (typeof document !== 'undefined' && document.fonts && document.fonts.load) {
  ['400', '500', '600', '700', '800', '900'].forEach((w) => {
    document.fonts.load(`${w} 1em "Be Vietnam Pro"`, 'Aa Ă Ơ Ư ₂ →').catch(() => {});
  });
  ['500', '700'].forEach((w) => document.fonts.load(`${w} 1em "JetBrains Mono"`).catch(() => {}));
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
