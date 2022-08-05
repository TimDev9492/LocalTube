import * as React from 'react';
import { LocalTubeDatabase } from '../backend/structure';
import Header from './components/Header';
import PageContent, { PageContentData, Tab } from './components/PageContent';

export const DatabaseContext = React.createContext<[database: LocalTubeDatabase, pullDatabase: Function]>([null, null]);
export const PageContext = React.createContext<[pageContent: PageContentData, setPageContent: Function]>([null, null]);

export default function LocalTube(): JSX.Element {
    React.useEffect(() => {
        window.localtubeAPI.signalMpvTimePosChange();
        window.localtubeAPI.getDatabase().then(
            (database) => setDatabaseContent(database),
            (error) => console.error(error)
        );
    }, []);

    const [pageContent, setPageContent] = React.useState<PageContentData>(new PageContentData(Tab.Add, null));
    const [databaseContent, setDatabaseContent] = React.useState<LocalTubeDatabase>({ shows: [] });

    return <DatabaseContext.Provider value={[databaseContent, setDatabaseContent]}>
        <PageContext.Provider value={[pageContent, setPageContent]}>
            <div className="min-h-screen flex flex-col">
                <Header shows={databaseContent.shows} />
                <PageContent database={databaseContent} contentData={pageContent} />
            </div>
        </PageContext.Provider>
    </DatabaseContext.Provider>

}