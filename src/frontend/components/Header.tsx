import * as React from 'react';
import localtubeIcon from '../../../assets/localtube_icon.png';
import { ShowList } from './ShowList';
import { PageContext } from '../LocalTube';
import { PageContentData, Tab } from './PageContent';
import { LocalShow } from '../../backend/structure';

export default function Header({ shows }: { shows: LocalShow[] }): JSX.Element {
    const [searchQuery, setSearchQuery] = React.useState<string>('');
    const [searchFocused, setSearchFocused] = React.useState<boolean>(false);
    let hideTimeout: NodeJS.Timeout;

    return <PageContext.Consumer>
        {([pageContent, setPageContent]) =>
            <nav className="bg-white dark:bg-slate-800 shadow py-4 select-none">
                <div className="max-w-7xl mx-auto px-32">
                    <div className="flex items-center justify-between h-16">
                        <div className=" flex items-center">
                            <a className="flex-shrink-0">
                                <img className="h-16 w-16" src={localtubeIcon} alt="localtube" />
                            </a>
                            <div className="hidden md:block">
                                <div className="ml-10 flex items-baseline space-x-4">
                                    <div onClick={() => setPageContent(new PageContentData(Tab.Show, 'Stranger Things S4'))} className="group cursor-pointer flex items-center text-slate-300  hover:text-slate-800 dark:hover:text-white px-3 py-2 rounded-md text-md font-medium">
                                        <svg role="add" className="inline h-4 w-4 mr-2 dark:fill-slate-300 dark:group-hover:fill-white"
                                            viewBox="0 0 330.242 330.242" fill="none">
                                            <path d="M324.442,129.811l-41.321-33.677V42.275c0-6.065-4.935-11-11-11h-26c-6.065,0-11,4.935-11,11v14.737l-55.213-44.999
	c-3.994-3.254-9.258-5.047-14.822-5.047c-5.542,0-10.781,1.782-14.753,5.019L5.8,129.81c-6.567,5.351-6.173,10.012-5.354,12.314
	c0.817,2.297,3.448,6.151,11.884,6.151h19.791v154.947c0,11.058,8.972,20.053,20,20.053h62.5c10.935,0,19.5-8.809,19.5-20.053
	v-63.541c0-5.446,5.005-10.405,10.5-10.405h42c5.238,0,9.5,4.668,9.5,10.405v63.541c0,10.87,9.388,20.053,20.5,20.053h61.5
	c11.028,0,20-8.996,20-20.053V148.275h19.791c8.436,0,11.066-3.854,11.884-6.151C330.615,139.822,331.009,135.161,324.442,129.811z"/>
                                        </svg>
                                        <a>Home</a>
                                    </div>
                                    <div onClick={() => setPageContent(new PageContentData(Tab.Add, null))} className="group cursor-pointer flex items-center text-slate-300  hover:text-slate-800 dark:hover:text-white px-3 py-2 rounded-md text-md font-medium">
                                        <svg role="add" className="inline h-4 w-4 mr-2 dark:fill-slate-300 dark:group-hover:fill-white"
                                            viewBox="0 0 60.364 60.364" fill="none">
                                            <path d="M54.454,23.18l-18.609-0.002L35.844,5.91C35.845,2.646,33.198,0,29.934,0c-3.263,0-5.909,2.646-5.909,5.91v17.269
		L5.91,23.178C2.646,23.179,0,25.825,0,29.088c0.002,3.264,2.646,5.909,5.91,5.909h18.115v19.457c0,3.267,2.646,5.91,5.91,5.91
		c3.264,0,5.909-2.646,5.91-5.908V34.997h18.611c3.262,0,5.908-2.645,5.908-5.907C60.367,25.824,57.718,23.178,54.454,23.18z"/>
                                        </svg>
                                        <a>Add show</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="block">
                            <div className="md:block -mr-2 flex">
                                <div className="flex flex-col md:flex-row w-3/4 md:w-full max-w-sm md:space-x-3 space-y-3 md:space-y-0 justify-center">
                                    <div className="relative ">
                                        <input onFocus={() => setSearchFocused(true)} onBlur={() => setTimeout(() => setSearchFocused(false), 200)} type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="rounded-lg border-transparent flex-1 appearance-none border border-slate-300 w-full py-2 px-4 bg-white text-slate-700 placeholder-slate-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent" placeholder="Search Shows..." />
                                        <div className="absolute top-full">
                                            <ShowList shows={shows.filter(show => (searchQuery.length || searchFocused) && show.metadata.title.toLowerCase().includes(searchQuery.toLowerCase())).map(show => show.metadata)}></ShowList>
                                        </div>
                                    </div>
                                    <button onClick={() => setSearchQuery('')} className="flex-shrink-0 px-4 py-2 text-base font-semibold text-white bg-purple-600 rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-purple-200">
                                        Clear
                                    </button>
                                </div>
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
            </nav>
        }
    </PageContext.Consumer>
}