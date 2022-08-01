import * as React from 'react';
import { LocalShow } from '../../backend/structure';
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

export default function PageContent({ contentData }: { contentData: PageContentData }): JSX.Element {
    // React hook for loading and setting page content
    const [data, setContentData] = React.useState<LocalShow | LocalShow[]>(null);

    // start loading page content
    React.useEffect(() => {
        switch (contentData.getTab()) {
            case Tab.Show:
                // if in show tab, the data attribute of contentData contains the name of the show
                window.localtubeAPI.getDatabase().then((database) => {
                    setContentData(database.shows.find(show => show.metadata.title === contentData.getData()));
                }, (error) => {
                    console.error(error);
                });
                break;
        }
    }, []);

    return <div className="dark:bg-slate-700 flex items-center justify-center flex-1 p-16">
        {contentData.getTab() === Tab.Show && <ShowAccordion show={data as LocalShow} />}
    </div>
}