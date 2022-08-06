import { PathLike } from 'original-fs';
import * as React from 'react';
import { LocalShow, LocalTubeDatabase } from '../../backend/structure';
import { DatabaseContext } from '../LocalTube';
import { AddShow } from './tabs/AddShow';
import { Overview } from './tabs/Overview';
import { ShowAccordion } from './tabs/ShowAccordion';

export enum Tab {
    Home,
    Add,
    Show,
}

export class PageContentData {
    private tab: Tab;
    private data: string;

    public constructor(tab: Tab, data: string) {
        this.tab = tab;
        this.data = data;
    }

    public getTab() {
        return this.tab;
    }

    public getData() {
        return this.data;
    }
}

export default function PageContent({ database, contentData }: { database: LocalTubeDatabase, contentData: PageContentData }): JSX.Element {
    // React hook for loading and setting page content
    const [data, setContentData] = React.useState<LocalShow | LocalShow[]>(null);

    // React hook for setting active video
    const [activeVideoPath, setActiveVideoByPath] = React.useState<PathLike>(null);

    React.useEffect(() => {
        window.localtubeAPI.onMpvExit((_event) => {
            setActiveVideoByPath(null);
        })
    }, []);

    // start loading page content
    React.useEffect(() => {
        switch (contentData.getTab()) {
            case Tab.Show:
                // if in show tab, the data attribute of contentData contains the name of the show
                setContentData(database.shows.find(show => show.metadata.title === contentData.getData()));
                console.log('db', database);
                console.log('data', database.shows.find(show => show.metadata.title === contentData.getData()));
                break;
            case Tab.Home:
                setContentData(database.shows);
                break;
        }
    }, [contentData, database]);

    return <div className="dark:bg-slate-700 flex items-center justify-center flex-1 p-16">
        {contentData.getTab() === Tab.Show && <ShowAccordion activeVideoPath={activeVideoPath} setActiveVideoByPath={setActiveVideoByPath} show={data as LocalShow} />}
        {contentData.getTab() === Tab.Add && <DatabaseContext.Consumer>{([database, pullDatabase]) => <AddShow pullDatabase={pullDatabase} />}</DatabaseContext.Consumer>}
        {contentData.getTab() === Tab.Home && <Overview shows={data as LocalShow[]} />}
    </div>
}