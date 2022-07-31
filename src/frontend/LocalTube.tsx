import * as React from 'react';
import { LocalShow } from '../backend/structure';
import Header from './components/Header';
import PageContent, { PageContentData, Tab } from './components/PageContent';

export default function LocalTube(): JSX.Element {
    return <div className="min-h-screen flex flex-col">
        <Header />
        <PageContent contentData={new PageContentData(Tab.Show, 'Breaking Bad')} />
    </div>
}