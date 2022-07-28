import * as React from 'react';
import localtubeIcon from '../../assets/localtube_icon.png';
import { ShowList } from './ShowList';
import placeholder from '../../assets/harddisk.png';

const shows = [
    {
        title: 'Breaking Bad',
        imagePath: placeholder,
        seasonAmount: 5,
        episodeAmount: 132,
        duration: 86.2,
    },
    {
        title: 'Queen\'s Gambit',
        imagePath: placeholder,
        seasonAmount: 2,
        episodeAmount: 4,
        duration: 1.5,
    },
    {
        title: 'Harry Potter',
        imagePath: placeholder,
        seasonAmount: 7,
        episodeAmount: 7,
        duration: 14.3,
    },
    {
        title: 'Stranger Things',
        imagePath: placeholder,
        seasonAmount: 4,
        episodeAmount: 136,
        duration: 41.3,
    },
]

export default function Header(): JSX.Element {
    const [searchQuery, setSearchQuery] = React.useState('');

    return <div>
        <nav className="bg-white dark:bg-slate-800 shadow py-4 ">
            <div className="max-w-7xl mx-auto px-32">
                <div className="flex items-center justify-between h-16">
                    <div className=" flex items-center">
                        <a className="flex-shrink-0">
                            <img className="h-16 w-16" src={localtubeIcon} alt="localtube" />
                        </a>
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-4">
                                <a className="text-slate-300  hover:text-slate-800 dark:hover:text-white px-3 py-2 rounded-md text-md font-medium">
                                    Home
                                </a>
                                <a className="text-slate-800 dark:text-white  hover:text-slate-800 dark:hover:text-white px-3 py-2 rounded-md text-md font-medium">
                                    Gallery
                                </a>
                                <a className="text-slate-300  hover:text-slate-800 dark:hover:text-white px-3 py-2 rounded-md text-md font-medium">
                                    Content
                                </a>
                                <a className="text-slate-300  hover:text-slate-800 dark:hover:text-white px-3 py-2 rounded-md text-md font-medium">
                                    Contact
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="block">
                        <div className="md:block -mr-2 flex">
                            <form className="flex flex-col md:flex-row w-3/4 md:w-full max-w-sm md:space-x-3 space-y-3 md:space-y-0 justify-center">
                                <div className="relative ">
                                    <input type="text" id="&quot;form-subscribe-Search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="rounded-lg border-transparent flex-1 appearance-none border border-slate-300 w-full py-2 px-4 bg-white text-slate-700 placeholder-slate-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent" placeholder="Search Shows..." />
                                    <div className="absolute top-full">
                                        <ShowList shows={shows.filter(show => searchQuery.length && show.title.toLowerCase().includes(searchQuery.toLowerCase()))}></ShowList>
                                    </div>
                                </div>
                                <button onClick={() => setSearchQuery('')} className="flex-shrink-0 px-4 py-2 text-base font-semibold text-white bg-purple-600 rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-purple-200" type="submit">
                                    Clear
                                </button>
                            </form>
                        </div>
                        <div className="ml-4 flex items-center md:ml-6">
                        </div>
                    </div>
                    <div className="-mr-2 flex md:hidden">
                        <button className="text-slate-800 dark:text-white hover:text-slate-300 inline-flex items-center justify-center p-2 rounded-md focus:outline-none">
                            <svg width="20" height="20" fill="currentColor" className="h-8 w-8" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1664 1344v128q0 26-19 45t-45 19h-1408q-26 0-45-19t-19-45v-128q0-26 19-45t45-19h1408q26 0 45 19t19 45zm0-512v128q0 26-19 45t-45 19h-1408q-26 0-45-19t-19-45v-128q0-26 19-45t45-19h1408q26 0 45 19t19 45zm0-512v128q0 26-19 45t-45 19h-1408q-26 0-45-19t-19-45v-128q0-26 19-45t45-19h1408q26 0 45 19t19 45z">
                                </path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            <div className="md:hidden">
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    <a className="text-slate-300 hover:text-slate-800 dark:hover:text-white block px-3 py-2 rounded-md text-base font-medium">
                        Home
                    </a>
                    <a className="text-slate-800 dark:text-white block px-3 py-2 rounded-md text-base font-medium">
                        Gallery
                    </a>
                    <a className="text-slate-300 hover:text-slate-800 dark:hover:text-white block px-3 py-2 rounded-md text-base font-medium">
                        Content
                    </a>
                    <a className="text-slate-300 hover:text-slate-800 dark:hover:text-white block px-3 py-2 rounded-md text-base font-medium">
                        Contact
                    </a>
                </div>
                <div className="p-2 flex">
                    <form className="flex flex-col md:flex-row w-3/4 md:w-full max-w-sm md:space-x-3 space-y-3 md:space-y-0 justify-center">
                        <div className=" relative ">
                            <input type="text" id="&quot;form-subscribe-Search" className=" rounded-lg border-transparent flex-1 appearance-none border border-slate-300 w-full py-2 px-4 bg-white text-slate-700 placeholder-slate-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent" placeholder="components" />
                        </div>
                        <button className="flex-shrink-0 px-4 py-2 text-base font-semibold text-white bg-purple-600 rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-purple-200" type="submit">
                            Search
                        </button>
                    </form>
                </div>
            </div>
        </nav>
    </div>

}