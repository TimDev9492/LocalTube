import * as React from 'react';
import { createRoot } from 'react-dom/client'

const container = document.getElementById('app');
const root = createRoot(container!);
root.render(<div className="h-screen flex items-center justify-center bg-gray-200">
    <h1 className="text-red-500">Hello Tailwind</h1>
</div>);