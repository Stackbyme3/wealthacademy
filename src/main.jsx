import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

import './styles/tokens/colors.css';
import './styles/tokens/typography.css';
import './styles/tokens/spacing.css';
import './styles/tokens/radii.css';
import './styles/tokens/shadows.css';
import './styles/styles.css';
import './styles/global.css';

createRoot(document.getElementById('root')).render(<App />);
