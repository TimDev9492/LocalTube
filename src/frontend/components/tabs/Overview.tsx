import * as React from 'react';
import { LocalShow, LocalShowContent, LocalVideo } from '../../../backend/structure';
import placeholder from '../../../../assets/placeholder.png';
import converter from '../../../backend/workers/convert';
import settings from '../../../settings';
import icon from '../../../../assets/localtube_icon.png';
import { PageContext } from '../../../frontend/LocalTube';
import { PageContentData, Tab } from '../PageContent';

export function Overview({ shows }: { shows: LocalShow[] }): JSX.Element {
    return <div className="max-w-6xl h-full text-lg select-none">
        <div className="fixed top-1/3 left-3/4 -translate-x-1/2 translate-y-1/4 opacity-20">
            <img draggable="false" src={icon} />
        </div>
        <div className="py-8">
            <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
                <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
                    {shows && shows.length && <table className="min-w-full leading-normal">
                        <thead>
                            <tr>
                                <th scope="col" className="px-5 py-3 bg-slate-800  border-b border-slate-700 text-slate-400  text-left uppercase font-normal">
                                    Show
                                </th>
                                <th scope="col" className="px-5 py-3 bg-slate-800  border-b border-slate-700 text-slate-400  text-left uppercase font-normal">
                                    Content
                                </th>
                                <th scope="col" className="px-5 py-3 bg-slate-800  border-b border-slate-700 text-slate-400  text-left uppercase font-normal">
                                    Watched
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {shows.map(show => <ShowListEntry key={show.metadata.title} show={show}></ShowListEntry>)}
                        </tbody>
                    </table>}
                </div>
            </div>
        </div>
    </div>
}

function ShowListEntry({ show }: { show: LocalShow }) {
    const [base64data, setBase64data] = React.useState<string>(null);
    const percentage = show.isConventionalShow ?
        Math.round(100 * getWatchTimeFromShowContent(show.content as LocalShowContent) / show.metadata.totalDuration) :
        Math.round(100 * getWatchTimeFromVideos(show.content as LocalVideo[]) / show.metadata.totalDuration);

    function getWatchTimeFromVideos(videos: LocalVideo[]) {
        return videos.reduce((previousWatchTime: number, video: LocalVideo) => previousWatchTime + getWatchTimeOfEpisode(video), 0);
    }

    function getWatchTimeOfEpisode(episode: LocalVideo) {
        return episode.metadata.duration - episode.metadata.timePos > settings.END_TIME_THRESHOLD ? episode.metadata.timePos : episode.metadata.duration;
    }

    function getWatchTimeOfSeason(seasonContent: { [episode: string]: LocalVideo }): number {
        return Object.keys(seasonContent).reduce((previousWatchTime: number, episodeNo: string) => previousWatchTime + getWatchTimeOfEpisode(seasonContent[episodeNo]), 0);
    }

    function getWatchTimeFromShowContent(content: LocalShowContent) {
        return Object.keys(content).reduce((previousWatchTime: number, seasonNo: string) => previousWatchTime + getWatchTimeOfSeason(content[seasonNo]), 0);
    }

    React.useEffect(() => {
        window.localtubeAPI.getThumbnailBuffer(show.metadata.thumbnailPath, true).then(
            (bufferData) => converter.getAsBase64(bufferData).then(
                (base64) => setBase64data(base64),
                (error) => console.error(error)
            ),
            (error) => console.error(error)
        );
    }, []);

    return <PageContext.Consumer>
        {([pageContent, setPageContent]) => <>
            <tr onClick={() => setPageContent(new PageContentData(Tab.Show, show.metadata.title))} className="group relative cursor-pointer transition-colors duration-100 ease-in bg-slate-800 hover:bg-slate-900">
                <td className="pl-5 pr-16 py-5 border-b border-slate-700 text-sm">
                    <div className="flex items-center">
                        <div className="flex-shrink-0" style={{
                            WebkitMaskImage: 'linear-gradient(to right, black 0%, transparent 100%)'
                        }}>
                            <img draggable="false" src={base64data ? `data:image/jpg;base64,${base64data}` : placeholder} className="mx-auto object-cover aspect-video h-20" />
                        </div>
                        <div className="-ml-16 pt-8">
                            <div className="text-white whitespace-no-wrap text-xl font-semibold">
                                {show.metadata.title}
                            </div>
                        </div>
                    </div>
                </td>
                <td className="pl-5 pr-16 py-5 border-b border-slate-700 text-sm">
                    <div className="flex flex-col gap-2 items-start">
                        <div className="flex items-center text-slate-200 text-sm font-medium italic">
                            <svg role="add" className="inline h-4 w-4 mr-2"
                                viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect><polyline points="17 2 12 7 7 2"></polyline>
                            </svg>
                            {`${show.metadata.seasonTotal} season${show.metadata.seasonTotal !== 1 ? 's' : ''}`}
                        </div>
                        <div className="flex items-center text-slate-200 text-sm font-medium italic">
                            <svg role="add" className="inline h-4 w-4 mr-2 dark:fill-slate-200"
                                viewBox="0 0 24 24" fill="none">
                                <path fill="none" d="M0 0h24v24H0z" />
                                <path d="M2 3.993A1 1 0 0 1 2.992 3h18.016c.548 0 .992.445.992.993v16.014a1 1 0 0 1-.992.993H2.992A.993.993 0 0 1 2 20.007V3.993zM4 5v14h16V5H4zm6.622 3.415l4.879 3.252a.4.4 0 0 1 0 .666l-4.88 3.252a.4.4 0 0 1-.621-.332V8.747a.4.4 0 0 1 .622-.332z" />
                            </svg>
                            {`${show.metadata.episodeTotal} episode${show.metadata.episodeTotal !== 1 ? 's' : ''}`}
                        </div>
                        <div className="flex items-center text-slate-200 text-sm font-medium italic">
                            <svg role="add" className="inline h-4 w-4 mr-2 dark:fill-slate-200"
                                viewBox="0 0 466.008 466.008" fill="none">
                                <path d="M233.004,0C104.224,0,0,104.212,0,233.004c0,128.781,104.212,233.004,233.004,233.004
			c128.782,0,233.004-104.212,233.004-233.004C466.008,104.222,361.796,0,233.004,0z M244.484,242.659l-63.512,75.511
			c-5.333,6.34-14.797,7.156-21.135,1.824c-6.34-5.333-7.157-14.795-1.824-21.135l59.991-71.325V58.028c0-8.284,6.716-15,15-15
			s15,6.716,15,15v174.976h0C248.004,236.536,246.757,239.956,244.484,242.659z"/>
                            </svg>
                            {`${Number(show.metadata.totalDuration / 3600).toFixed(1)}h`}
                        </div>
                    </div>
                </td>
                <td className="pl-5 pr-32 py-5 border-b border-slate-700 text-sm">
                    <div className="flex items-center text-slate-200  px-2.5 py-1.5 text-sm font-medium dark:bg-red-500 rounded-full w-fit">
                        <svg role="add" className="inline h-4 w-4 mr-1 dark:fill-slate-200"
                            viewBox="0 0 20 20" fill="none">
                            <path d="M9.0971295,8.03755188 L9.0971295,2.84790039 C9.13471211,2.50546265 9.32401021,2.28468831 9.6650238,2.18557739 C10.0060374,2.08646647 10.3434812,2.17325872 10.6773552,2.44595413 L18.762796,9.28367933 C18.985685,9.48122766 19.0971295,9.72000122 19.0971295,10 C19.0971295,10.2799988 18.985685,10.5192994 18.762796,10.717902 L10.6237488,17.6020203 C10.2899882,17.8323466 9.96312968,17.9007416 9.64317322,17.8072052 C9.32321676,17.7136688 9.14120218,17.5091349 9.0971295,17.1936035 L9.0971295,11.9564819 L2.48309625,17.5543198 C2.15246682,17.8183996 1.80385844,17.9026947 1.43727112,17.8072052 C1.0706838,17.7117157 0.892550258,17.5071818 0.902870501,17.1936035 L0.902870501,2.93100117 C0.89243836,2.60200039 1.04287211,2.36458333 1.35417175,2.21875 C1.66547139,2.07291667 2.0218455,2.13023885 2.42329407,2.39071655 L9.0971295,8.03755188 Z" />
                        </svg>
                        {`${percentage}%`}
                    </div>
                </td>
            </tr>
            {/* <div className="absolute top-1/2 -translate-y-1/2 right-8 opacity-0 transition-opacity duration-100 ease-in group-hover:opacity-75">
                <svg width="20" fill="currentColor" height="20" className="group-hover:text-slate-800 dark:group-hover:text-white dark:text-slate-400 text-slate-500 group-hover:scale-125 transition-transform w-10 h-10" viewBox="0 0 1792 1792">
                    <path d="M1363 877l-742 742q-19 19-45 19t-45-19l-166-166q-19-19-19-45t19-45l531-531-531-531q-19-19-19-45t19-45l166-166q19-19 45-19t45 19l742 742q19 19 19 45t-19 45z">
                    </path>
                </svg>
            </div> */}
        </>}
    </PageContext.Consumer>
}