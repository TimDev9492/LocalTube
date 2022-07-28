import * as React from 'react';
import Header from './components/Header';
import PageContent from './components/PageContent';

export default function LocalTube(): JSX.Element {
    return <div className="min-h-screen flex flex-col">
        <Header />
        <PageContent />
    </div>
}