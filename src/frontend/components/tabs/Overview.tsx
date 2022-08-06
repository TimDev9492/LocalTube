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
            <img className="rotate-6" draggable="false" src={icon} />
        </div>
        <div className="py-8">
            <div className="-mx-4 sm:-mx-8 px-8 sm:px-8 py-8 overflow-x-auto">
                {shows && shows.length ? <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
                    <table className="min-w-full leading-normal">
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
                    </table>
                </div>
                    : <div className="flex items-center text-slate-800 fill-slate-800 -rotate-3 overflow-visible">
                        <svg role="add" className="h-48 animate-wiggle"
                            viewBox="0 0 512 512" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <g>
                                <g>
                                    <path d="M264.551,256.534h-17.102c-4.427,0-8.017,3.589-8.017,8.017s3.589,8.017,8.017,8.017h17.102
			c4.427,0,8.017-3.589,8.017-8.017S268.979,256.534,264.551,256.534z"/>
                                </g>
                            </g>
                            <g>
                                <g>
                                    <path d="M392.24,306.473c0-0.002,0-0.003,0-0.005L377.443,165.9c-0.96-9.119-4.86-17.479-10.813-24.012V42.221
			c0-13.851-11.268-25.119-25.119-25.119h-37.397C290.967,6.419,274.223,0,256,0c-18.223,0-34.967,6.419-48.114,17.102h-37.397
			c-13.851,0-25.119,11.268-25.119,25.119v99.667c-5.953,6.533-9.853,14.894-10.813,24.012L119.76,306.468c0,0.002,0,0.003,0,0.005
			c-0.029,0.275-0.044,0.553-0.044,0.834v0.004c0,0.002,0,0.003,0,0.005v34.195c0,13.851,11.268,25.119,25.119,25.119h17.102
			c4.427,0,8.017-3.589,8.017-8.017v-50.233l9.62-35.273v188.654h-0.534c-13.851,0-25.119,11.268-25.119,25.119v17.102
			c0,4.428,3.589,8.017,8.017,8.017h60.67c8.548,0,15.635-6.414,16.486-14.92l15.482-154.813c0.074-0.735,0.686-1.29,1.425-1.29
			c0.739,0,1.351,0.555,1.425,1.29l15.482,154.813c0.85,8.505,7.938,14.92,16.486,14.92h60.67c4.427,0,8.017-3.588,8.017-8.017
			v-17.102c0-13.851-11.268-25.119-25.119-25.119h-0.534V273.108l9.62,35.273v50.233c0,4.427,3.589,8.017,8.017,8.017h17.102
			c13.851,0,25.119-11.268,25.119-25.119v-34.195c0-0.002,0-0.003,0-0.005v-0.004C392.284,307.025,392.269,306.747,392.24,306.473z
			 M341.511,33.136c5.01,0,9.086,4.076,9.086,9.086v9.086h-22.433c-2.269-6.5-5.385-12.601-9.228-18.171H341.511z M331.867,67.34
			h18.73v63.596c-0.594-0.229-1.183-0.468-1.792-0.671l-22.238-7.413c3.768-9.035,5.859-18.939,5.859-29.324V76.426
			C332.426,73.35,332.222,70.323,331.867,67.34z M195.608,78.707C211.819,65.856,233.144,58.789,256,58.789
			c4.427,0,8.017-3.589,8.017-8.017s-3.589-8.017-8.017-8.017c-20.763,0-40.531,5.096-57.281,14.576
			c8.01-23.969,30.653-41.299,57.281-41.299c26.658,0,49.323,17.37,57.309,41.381c-6.475-3.658-13.428-6.721-20.685-9.037
			c-4.219-1.348-8.729,0.981-10.075,5.198c-1.347,4.218,0.98,8.729,5.198,10.075c10.614,3.389,20.446,8.583,28.645,15.063v14.815
			c0,33.3-27.092,60.392-60.392,60.392s-60.391-27.092-60.391-60.392V78.707z M256,169.954c25.941,0,48.889-13.002,62.712-32.819
			l3.061,1.02l-36.067,50.492c-1.3-0.328-2.652-0.522-4.052-0.522h-51.307c-1.4,0-2.753,0.193-4.052,0.523l-36.067-50.492
			l3.061-1.02C207.111,156.952,230.059,169.954,256,169.954z M229.812,222.33v-17.637c0-0.295,0.239-0.534,0.534-0.534h51.307
			c0.295,0,0.534,0.239,0.534,0.534v17.637H229.812z M282.188,238.363v43.29c0,0.295-0.239,0.534-0.534,0.534h-51.307
			c-0.295,0-0.534-0.239-0.534-0.534v-43.29H282.188z M161.403,42.221c0-5.01,4.076-9.086,9.086-9.086h22.575
			c-3.843,5.57-6.96,11.671-9.228,18.171h-22.433V42.221z M161.403,67.34h18.73c-0.355,2.982-0.559,6.009-0.559,9.086v17.102
			c0,10.385,2.091,20.289,5.859,29.324l-22.238,7.413c-0.608,0.203-1.197,0.443-1.791,0.671V67.34z M153.921,350.597h-9.086
			c-5.01,0-9.086-4.076-9.086-9.086v-26.188h18.171V350.597z M155.814,299.29h-19.176l1.792-17.022l20.191,6.731L155.814,299.29z
			 M162.846,273.506l-22.698-7.566l9.075-86.215l29.534,35.441L162.846,273.506z M152.897,159.089
			c3.013-6.327,8.506-11.326,15.369-13.612l6.049-2.016l40.216,56.302c-0.487,1.558-0.75,3.215-0.75,4.932v68.943h-18.172v-60.392
			h-0.009c0-1.853-0.634-3.675-1.849-5.132L152.897,159.089z M223.139,495.486c-0.027,0.275-0.255,0.481-0.531,0.481h-52.654v-9.086
			c0-5.01,4.076-9.086,9.086-9.086h8.551c4.427,0,8.017-3.589,8.017-8.017v-9.086h31.011L223.139,495.486z M228.222,444.66h-32.614
			v-43.825h36.997L228.222,444.66z M234.208,384.802h-38.601v-56.108l42.153,20.582L234.208,384.802z M270.801,333.112
			c-3.097-4.945-8.581-8.168-14.801-8.168c-6.22,0-11.704,3.224-14.801,8.168l-45.591-22.261V289.67h20.25
			c2.829,5.093,8.26,8.551,14.489,8.551h51.307c6.228,0,11.659-3.458,14.489-8.551h20.25v21.181L270.801,333.112z M274.24,349.276
			l42.153-20.583v56.108h-38.601L274.24,349.276z M279.396,400.835h36.997v43.825h-32.614L279.396,400.835z M332.96,477.795
			c5.01,0,9.086,4.076,9.086,9.086v9.086h-52.654c-0.276,0-0.504-0.206-0.531-0.481l-3.479-34.792h31.011v9.086
			c0,4.427,3.589,8.017,8.017,8.017H332.96z M318.251,208.111c-1.215,1.458-1.849,3.279-1.85,5.133h-0.009v60.392h-18.171v-68.944
			c0-1.717-0.263-3.373-0.75-4.932l40.216-56.302l6.049,2.016c6.861,2.287,12.355,7.286,15.369,13.612L318.251,208.111z
			 M349.154,273.506l-15.911-58.339l29.534-35.441l9.075,86.215L349.154,273.506z M353.379,288.999l20.191-6.731l1.792,17.022
			h-19.176L353.379,288.999z M376.251,341.511c0,5.01-4.076,9.086-9.086,9.086h-9.086v-35.273h18.171V341.511z"/>
                                </g>
                            </g>
                        </svg>
                        <h1 className="text-8xl font-base">Such empty...</h1>
                    </div>}
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