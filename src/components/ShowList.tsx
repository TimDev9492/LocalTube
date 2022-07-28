import * as React from 'react';
import placeholder from '../../assets/harddisk.png';

interface ShowInfo {
    title: string;
    imagePath: string;
    seasonAmount: number;
    episodeAmount: number;
    duration: number;
}

export function ShowList({ shows }: { shows: ShowInfo[] }): JSX.Element {
    return <div className="container flex flex-col mx-auto w-full items-center justify-center bg-white dark:bg-slate-800 rounded-lg shadow">
        <ul className="flex flex-col divide divide-y">
            {shows.map(show => <ShowCard key={show.title} title={show.title} imagePath={show.imagePath} seasonAmount={show.seasonAmount} episodeAmount={show.episodeAmount} duration={show.duration}></ShowCard>)}
        </ul>
    </div>
}

export function ShowCard({ title, imagePath, seasonAmount, episodeAmount, duration }: ShowInfo): JSX.Element {
    return <li className="group flex flex-row">
        <div className="select-none cursor-pointer flex flex-1 items-center p-4 dark:hover:bg-slate-600 transition-colors rounded">
            <div className="flex flex-col w-10 h-10 justify-center items-center mr-4">
                <a href="#" className="block relative">
                    <img alt="profil" src={imagePath} className="mx-auto object-cover rounded-full h-10 w-10 " />
                </a>
            </div>
            <div className="flex-1 pl-1 mr-8 w-48">
                <div className="font-medium dark:text-white">
                    {title}
                </div>
                <div className="text-slate-600 dark:text-slate-200 text-sm">
                    {`${seasonAmount} season${seasonAmount !== 1 && 's'}, ${episodeAmount} episode${episodeAmount !== 1 && 's'}`}
                </div>
            </div>
            <div className="text-slate-600 dark:text-slate-200 text-xs">
                {`${duration}h`}
            </div>
            <button className="w-12 text-right flex justify-end">
                <svg width="20" fill="currentColor" height="20" className="group-hover:text-slate-800 dark:group-hover:text-white dark:text-slate-400 text-slate-500 group-hover:scale-125 transition-transform" viewBox="0 0 1792 1792">
                    <path d="M1363 877l-742 742q-19 19-45 19t-45-19l-166-166q-19-19-19-45t19-45l531-531-531-531q-19-19-19-45t19-45l166-166q19-19 45-19t45 19l742 742q19 19 19 45t-19 45z">
                    </path>
                </svg>
            </button>
        </div>
    </li>
}