import * as React from 'react';
import { createRoot } from 'react-dom/client'
import LocalTube  from './LocalTube';

const container = document.getElementById('app');
const root = createRoot(container!);
root.render(<LocalTube />);