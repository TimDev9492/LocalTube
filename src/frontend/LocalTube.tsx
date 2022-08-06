import * as React from 'react';
import { LocalTubeDatabase } from '../backend/structure';
import Header from './components/Header';
import PageContent, { PageContentData, Tab } from './components/PageContent';

export const DatabaseContext = React.createContext<[database: LocalTubeDatabase, pullDatabase: Function]>([null, null]);
export const PageContext = React.createContext<[pageContent: PageContentData, setPageContent: Function]>([null, null]);

// TODO
// - refresh show progress on home load

export default function LocalTube(): JSX.Element {
    React.useEffect(() => {
        window.localtubeAPI.signalMpvTimePosChange();
        // pullDatabase();
    }, []);

    const pullDatabase = (): void => {
        window.localtubeAPI.getDatabase().then(
            (database) => setDatabaseContent(database),
            (error) => console.error(error)
        );
    }

    const [pageContent, setPageContent] = React.useState<PageContentData>(new PageContentData(Tab.Home, null));
    const [databaseContent, setDatabaseContent] = React.useState<LocalTubeDatabase>({ shows: [] });

    React.useEffect(() => {
        pullDatabase();
    }, [pageContent])

    return <DatabaseContext.Provider value={[databaseContent, pullDatabase]}>
        <PageContext.Provider value={[pageContent, setPageContent]}>
            <div className="min-h-screen flex flex-col">
                <Header shows={databaseContent.shows} />
                <PageContent database={databaseContent} pullDatabase={pullDatabase} contentData={pageContent} />
            </div>
        </PageContext.Provider>
    </DatabaseContext.Provider>

}