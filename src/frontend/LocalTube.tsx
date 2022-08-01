import * as React from 'react';
import Header from './components/Header';
import PageContent, { PageContentData, Tab } from './components/PageContent';

export default function LocalTube(): JSX.Element {
    React.useEffect(() => {
        window.localtubeAPI.signalMpvTimePosChange();
    }, []);

    return <div className="min-h-screen flex flex-col">
        <Header />
        <PageContent contentData={new PageContentData(Tab.Show, 'Breaking Bad')} />
    </div>
}