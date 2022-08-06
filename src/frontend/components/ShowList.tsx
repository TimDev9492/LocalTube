import * as React from 'react';
import { LocalShowMetadata } from '../../backend/structure';
import { PageContext } from '../LocalTube';
import { PageContentData, Tab } from './PageContent';
import placeholder from '../../../assets/placeholder.png';
import converter from '../../backend/workers/convert';

export function ShowList({ shows }: { shows: LocalShowMetadata[] }): JSX.Element {
    return <div className="container flex flex-col mx-auto w-full items-center justify-center bg-white dark:bg-slate-800 rounded-lg shadow">
        <ul className="flex flex-col divide divide-y">
            {shows.map(showMeta => <ShowCard key={showMeta.title} title={showMeta.title} thumbnailPath={showMeta.thumbnailPath} seasonTotal={showMeta.seasonTotal} episodeTotal={showMeta.episodeTotal} totalDuration={showMeta.totalDuration}></ShowCard>)}
        </ul>
    </div>
}

export function ShowCard({ title, thumbnailPath, seasonTotal, episodeTotal, totalDuration }: LocalShowMetadata): JSX.Element {
    const [base64data, setBase64data] = React.useState<string>(null);

    React.useEffect(() => {
        window.localtubeAPI.getThumbnailBuffer(thumbnailPath, true).then(
            (bufferData) => converter.getAsBase64(bufferData).then(
                (base64) => setBase64data(base64),
                (error) => console.error(error)
            ),
            (error) => console.error(error)
        );
    }, []);

    return <PageContext.Consumer>
        {([pageContent, setPageContent]) => <li className="group flex flex-row z-50">
            <div onClick={() => { setPageContent(new PageContentData(Tab.Show, title)); console.log(title) }} className="select-none cursor-pointer flex flex-1 items-center p-4 dark:hover:bg-slate-600 transition-colors rounded">
                <div className="flex flex-col w-12 h-12 justify-center items-center mr-4">
                    <img alt="profil" draggable="false" src={base64data ? `data:image/jpg;base64,${base64data}` : placeholder} className="object-cover rounded-lg h-full w-full " />
                </div>
                <div className="flex-1 pl-1 mr-8 w-48">
                    <div className="font-medium dark:text-white">
                        {title}
                    </div>
                    <div className="text-slate-600 dark:text-slate-200 text-sm">
                        {`${seasonTotal} season${seasonTotal !== 1 ? 's' : ''}, ${episodeTotal} episode${episodeTotal !== 1 ? 's' : ''}`}
                    </div>
                </div>
                <div className="text-slate-600 dark:text-slate-200 text-xs">
                    {`${(totalDuration / 3600).toFixed(1)}h`}
                </div>
                <button className="w-12 text-right flex justify-end">
                    <svg width="20" fill="currentColor" height="20" className="group-hover:text-slate-800 dark:group-hover:text-white dark:text-slate-400 text-slate-500 group-hover:scale-125 transition-transform" viewBox="0 0 1792 1792">
                        <path d="M1363 877l-742 742q-19 19-45 19t-45-19l-166-166q-19-19-19-45t19-45l531-531-531-531q-19-19-19-45t19-45l166-166q19-19 45-19t45 19l742 742q19 19 19 45t-19 45z">
                        </path>
                    </svg>
                </button>
            </div>
        </li>}
    </PageContext.Consumer>
}