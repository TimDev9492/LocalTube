import * as React from 'react';
import Header from './components/Header';
import PageContent, { PageContentData, Tab } from './components/PageContent';

export const PageContext = React.createContext<[pageContent: PageContentData, setPageContent: Function]>([null, null]);

export default function LocalTube(): JSX.Element {
    React.useEffect(() => {
        window.localtubeAPI.signalMpvTimePosChange();
    }, []);

    const [pageContent, setPageContent] = React.useState<PageContentData>(new PageContentData(Tab.Home, null));

    return <PageContext.Provider value={[pageContent, setPageContent]}>
        <div className="min-h-screen flex flex-col">
            <Header />
            <PageContent contentData={pageContent} />
        </div>
    </PageContext.Provider>
}