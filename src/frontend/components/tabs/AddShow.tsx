import { OpenDialogOptions } from 'electron';
import * as React from 'react';
import { RegExtractConfig } from '../../../backend/structure';
import DetectOutsideClick from '../DetectOutsideClick';

const FileExtensionsContext = React.createContext<[fileExtensions: string[], setPageContent: Function]>([null, null]);
const RegExtractContext = React.createContext<[regExtract: RegExtractConfig, setRegExtract: Function]>([null, null]);

export function AddShow(): JSX.Element {
    const [dirPath, setDirPath] = React.useState<string>('');
    const [isValidPath, setIsValidPath] = React.useState<boolean>(false);
    const [fileExtensions, setFileExtensions] = React.useState<string[]>([]);
    const [ignoreSubDirs, setIgnoreSubDirs] = React.useState<boolean>(false);
    const [regExtract, setRegExtract] = React.useState<RegExtractConfig>({
        regex: null,
        matchingGroups: {
            season: null,
            episode: null,
            title: null,
        },
        titleReplace: {
            searchValue: null,
            replaceValue: null,
        },
    } as RegExtractConfig);
    const [showRegSection, setShowRegSection] = React.useState<boolean>(true);

    React.useEffect(() => {
        console.log(fileExtensions);
    }, [fileExtensions]);

    React.useEffect(() => {
        if (!dirPath.length) {
            setIsValidPath(false);
            return;
        }
        window.localtubeAPI.checkDirPath(dirPath).then(
            (response) => setIsValidPath(response),
            (error) => console.error(error),
        );
    }, [dirPath]);

    const browseBtnClick = (): any => {
        window.localtubeAPI.openDialog({
            title: 'Choose your show directory...',
            properties: ['openDirectory', 'showHiddenFiles'],
        } as OpenDialogOptions).then(
            (dirPath) => dirPath && setDirPath(dirPath),
            (error) => console.error(error)
        );
    }

    return <FileExtensionsContext.Provider value={[fileExtensions, setFileExtensions]}>
        <RegExtractContext.Provider value={[regExtract, setRegExtract]}>
            <div className="text-xl font-light text-slate-600 sm:text-2xl dark:text-white select-none flex flex-col w-3/5 px-4 py-8 bg-white rounded-lg shadow dark:bg-slate-800 sm:px-6 md:px-8 lg:px-10">
                <div className="self-center mb-6">
                    Add a show
                </div>
                <div className="flex gap-4 justify-evenly">
                    <div className="relative w-full">
                        <input type="text" value={dirPath} onChange={(e) => setDirPath(e.target.value)} className="w-full rounded-lg border-transparent flex-1 appearance-none border border-gray-300 py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent" name="pseudo" spellCheck="false" placeholder="Show directory path" />
                        {isValidPath ?
                            <svg width="15" height="15" fill="currentColor" className="absolute fill-green-500 right-2 bottom-3" viewBox="0 0 342.357 342.357">
                                <polygon points="290.04,33.286 118.861,204.427 52.32,137.907 0,190.226 118.862,309.071 342.357,85.606 " />
                            </svg> :
                            <svg width="15" height="15" fill="currentColor" className="absolute text-red-500 right-2 bottom-3" viewBox="0 0 1792 1792">
                                <path d="M1024 1375v-190q0-14-9.5-23.5t-22.5-9.5h-192q-13 0-22.5 9.5t-9.5 23.5v190q0 14 9.5 23.5t22.5 9.5h192q13 0 22.5-9.5t9.5-23.5zm-2-374l18-459q0-12-10-19-13-11-24-11h-220q-11 0-24 11-10 7-10 21l17 457q0 10 10 16.5t24 6.5h185q14 0 23.5-6.5t10.5-16.5zm-14-934l768 1408q35 63-2 126-17 29-46.5 46t-63.5 17h-1536q-34 0-63.5-17t-46.5-46q-37-63-2-126l768-1408q17-31 47-49t65-18 65 18 47 49z">
                                </path>
                            </svg>}
                    </div>
                    <button onClick={browseBtnClick} value={dirPath} type="button" className="py-2 px-4 flex gap-2 justify-center items-center  bg-red-500 hover:bg-red-700 focus:ring-red-500 focus:ring-offset-red-200 text-white transition ease-in duration-100 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg">
                        <svg role="arrow" className="inline h-5 w-5 dark:fill-white"
                            viewBox="0 0 46 46" fill="none">
                            <path d="M20.701,11c-0.425,0-0.809-0.253-0.977-0.644l-1.395-3.255C17.523,5.22,15.673,4,13.626,4H5.117C2.291,4,0,6.291,0,9.117
		v1.758V18v17.625C0,39.146,2.854,42,6.375,42h33.25C43.146,42,46,39.146,46,35.625v-18.25C46,13.854,43.146,11,39.625,11H20.701z"/>
                        </svg>
                        Browse
                    </button>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex justify-between items-center mt-8 flex-1">
                        <h1 className="text-lg">Video file extensions</h1>
                        <FileExtensionsDropdown />
                    </div>
                    <div className="self-end h-12 border border-solid opacity-50 border-slate-600"></div>
                    <div className="flex justify-between items-center mt-8 flex-1">
                        <h1 className="text-lg">{ignoreSubDirs ? 'Ignore subdirectories' : 'Include subdirectories'}</h1>
                        <div className="relative inline-block w-10 mr-2 align-middle select-none">
                            <input type="checkbox" onChange={(e) => setIgnoreSubDirs(e.target.checked)} name="toggle" id="ignoreSubDirs" className="outline-none focus:outline-none right-4 checked:right-0 duration-100 ease-in absolute block w-6 h-6 rounded-full bg-slate-300 border-4 border-slate-400 appearance-none cursor-pointer" />
                            <label htmlFor="ignoreSubDirs" className="block overflow-hidden h-6 rounded-full bg-slate-500 cursor-pointer">
                            </label>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-4 mt-8">
                    <h1 className="text-lg">Extract video info from file path?</h1>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none">
                        <input type="checkbox" onChange={(e) => setShowRegSection(e.target.checked)} name="toggle" id="showSection" className="outline-none focus:outline-none right-4 checked:right-0 checked:bg-green-300 duration-100 ease-in absolute block w-6 h-6 rounded-full bg-slate-300 border-4 border-slate-400 appearance-none cursor-pointer" />
                        <label htmlFor="showSection" className="block overflow-hidden h-6 rounded-full bg-slate-500 cursor-pointer">
                        </label>
                    </div>
                </div>
                <div className="mt-4">
                    {showRegSection && <RegExtractSection />}
                </div>
                <div className="flex items-center justify-center mt-6">
                    <a href="#" target="_blank" className="inline-flex items-center text-xs font-thin text-center text-slate-500 hover:text-slate-700 dark:text-slate-100 dark:hover:text-white">
                        <span className="ml-2">
                            You don&#x27;t have an account?
                        </span>
                    </a>
                </div>
            </div >
        </RegExtractContext.Provider>
    </FileExtensionsContext.Provider>
}

function FileExtensionsDropdown(): JSX.Element {
    const [dropdownActive, setDropdownActive] = React.useState(false);
    const options = ['mkv', 'mp4', 'mov', 'avi', 'flv', 'wmv', 'avchd', 'webm', 'mpeg-4'];

    const toggleOption: any = (option: string, fileExtensions: string[], setFileExtensions: Function) => {
        console.log(option);
        const newArr: string[] = [];
        fileExtensions.forEach(fileExtension => fileExtension !== option && newArr.push(fileExtension));
        if (!fileExtensions.includes(option)) newArr.push(option);
        setFileExtensions(newArr);
    }

    return <div className="w-64">
        <FileExtensionsContext.Consumer>
            {([fileExtensions, setFileExtensions]) => <div className="mt-1 relative">
                <DetectOutsideClick onOutsideClick={() => setDropdownActive(false)}>
                    <button onClick={() => setDropdownActive(!dropdownActive)} type="button" className="relative w-full bg-white rounded-md shadow-lg pl-3 pr-10 py-3 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                        <span className="flex items-center">
                            <span className="ml-2 first-letter:block truncate text-gray-600">
                                {fileExtensions.length ? fileExtensions.join(', ') : 'Click to select'}
                            </span>
                        </span>
                        <span className="ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z">
                                </path>
                            </svg>
                        </span>
                    </button>
                    {dropdownActive && <div className="absolute mt-1 w-full z-10 rounded-md bg-white shadow-lg overflow-y-scroll">
                        <ul className="max-h-56 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                            {options.map(option => <li key={option} onClick={() => toggleOption(option, fileExtensions, setFileExtensions)} className="text-gray-900 cursor-default hover:bg-indigo-500 hover:text-white select-none relative py-2 pl-3 pr-9">
                                <div className="flex items-center">
                                    <span className="ml-3 block font-normal truncate">
                                        {option}
                                    </span>
                                </div>
                                {fileExtensions.includes(option) && <span className="absolute inset-y-0 right-0 flex items-center pr-4">
                                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z">
                                        </path>
                                    </svg>
                                </span>}
                            </li>)}
                        </ul>
                    </div>}
                </DetectOutsideClick>
            </div>}
        </FileExtensionsContext.Consumer>
    </div>;
}

function RegExtractSection(): JSX.Element {
    const [regexString, setRegexString] = React.useState<string>('');

    function changeRegexString(newRegexString: string, oldRegExtract: RegExtractConfig, setRegExtract: Function): any {
        setRegexString(newRegexString);
        try {
            const regex: RegExp = new RegExp(newRegexString);
            oldRegExtract.regex = regex;
            setRegExtract(oldRegExtract);
        } catch (err) {
            console.error(err);
        }
    }

    return <RegExtractContext.Consumer>
        {([regExtract, setRegExtract]) => <div className="flex flex-col border-l-4 border-slate-500 bg-slate-700 p-2 font-jetbrains">
            <div className="flex gap-4 items-center ml-4">
                <p className="text-sm">Regex:</p>
                {/*value={dirPath} onChange={(e) => setDirPath(e.target.value)}*/}
                <div className="w-full relative text-gray-700 text-sm">
                    <input value={regexString} onChange={(e) => changeRegexString(e.target.value, regExtract, setRegExtract)} type="text" className="px-5 w-full rounded-lg border-transparent flex-1 appearance-none border border-gray-300 py-2 bg-white placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent" name="pseudo" spellCheck="false" placeholder="Regular expression" />
                    <p className="absolute bottom-1.5 -translate-y-px left-2.5 text-base text-gray-400">/</p>
                    <p className="absolute bottom-1.5 -translate-y-px right-2.5 text-base text-gray-400">/</p>
                </div>
            </div>
        </div>}
    </RegExtractContext.Consumer>
}