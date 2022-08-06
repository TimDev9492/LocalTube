import { OpenDialogOptions } from 'electron';
import * as React from 'react';
import { deserializeRegexPretty } from '../../../frontend/utils';
import { FileConfig, RegExtractConfig } from '../../../backend/structure';
import DetectOutsideClick from '../DetectOutsideClick';
import Spinner from '../Spinner';

const FileExtensionsContext = React.createContext<[fileExtensions: string[], setPageContent: Function]>([null, null]);
const RegExtractContext = React.createContext<[regExtract: RegExtractConfig, setRegExtract: Function]>([null, null]);

export function AddShow({ pullDatabase }: { pullDatabase: Function }): JSX.Element {
    const [showName, setShowName] = React.useState<string>('');
    const [isValidShowName, setIsValidShowName] = React.useState<boolean>(false);
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
            searchValue: /(?:)/,
            replaceValue: '',
        },
    } as RegExtractConfig);
    const [showRegSection, setShowRegSection] = React.useState<boolean>(false);
    const [isConventionalShow, setIsConventionalShow] = React.useState<boolean>(true);
    const [conventionalShowTooltip, setConventionalShowTooltip] = React.useState<boolean>(false);
    const [isAddingShow, setIsAddingShow] = React.useState<boolean>(false);
    const [popupText, setPopupText] = React.useState<string>('');
    const [showPopup, setShowPopup] = React.useState<boolean>(false);
    const [popupStyle, setPopupStyle] = React.useState({ background: 'rgba(0, 0, 0, 0)', zIndex: -50 });

    React.useEffect(() => {
        if (!showName.length) {
            setIsValidShowName(false);
            return;
        }
        window.localtubeAPI.checkShowName(showName).then(
            (response) => setIsValidShowName(response),
            (error) => console.error(error),
        );
    }, [showName]);

    function btnAddShow() {
        if (!isValidShowName) {
            alert('There already exists a show with that name. Please use a unique name!');
            return;
        }
        if (!isValidPath) {
            alert('The show directory path you entered is not a valid directory!');
            return;
        }
        setIsAddingShow(true);
        window.localtubeAPI.addShow(
            dirPath,
            {
                fileExtensions,
                ignoreSubDirs,
                regExtract
            } as FileConfig,
            isConventionalShow,
            showName).then(
                (addedShowTitle) => {
                    setIsAddingShow(false);
                    setPopupText(addedShowTitle);
                    setPopupStyle({ background: 'rgba(0, 0, 0, .5)', zIndex: 50 });
                    setShowPopup(true);
                    pullDatabase();
                },
                (error) => alert(error)
            );
    }

    function onPopupClose() {
        setShowPopup(false);
        setPopupStyle({ background: 'rgba(0, 0, 0, 0)', zIndex: 50 });
        setTimeout(() => setPopupStyle({ background: 'rgba(0, 0, 0, 0)', zIndex: -50 }), 500);
    }

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
            <div className="fixed top-0 left-0 w-full h-full select-none transition-colors ease-linear duration-500" style={popupStyle}>
                <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-lg rounded-2xl p-4 bg-white dark:bg-gray-800 w-96 m-auto transition-all duration-500 ease-in-out" style={{
                    top: showPopup ? '50%' : 'calc(0% - 8rem)',
                }}>
                    <div className="w-full h-full text-center">
                        <div className="flex h-full flex-col justify-between">
                            <svg className="h-12 w-12 mt-4 m-auto text-green-500" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7">
                                </path>
                            </svg>
                            <p className="text-gray-600 dark:text-gray-100 text-md py-2 px-6">
                                <span className="font-bold">{popupText}</span>
                                {' has been successfully added to your local shows!'}
                            </p>
                            <div className="flex items-center justify-between gap-4 w-full mt-8">
                                <button onClick={() => onPopupClose()} type="button" className="py-2 px-4  bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-indigo-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg ">
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="text-xl font-light text-slate-600 sm:text-2xl dark:text-white select-none flex flex-col xl:min-w-6xl w-3/5 px-4 py-8 rounded-lg shadow dark:bg-slate-800 sm:px-6 md:px-8 lg:px-10">
                <div className="self-center text-3xl">
                    Add a show
                </div>
                <div className="relative flex flex-col gap-4 justify-evenly mt-4 items-center px-48 py-4">
                    <div className="absolute border border-slate-600 w-full top-0"></div>
                    <h1 className="text-base">Give the show a name: </h1>
                    <div className="relative w-full">
                        <input type="text" value={showName} onChange={(e) => setShowName(e.target.value)} className="w-full rounded-lg border-transparent flex-1 appearance-none border border-gray-300 py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent" name="pseudo" spellCheck="false" placeholder="Enter show name..." />
                        {isValidShowName ?
                            <svg width="15" height="15" fill="currentColor" className="absolute fill-green-500 right-2 bottom-3" viewBox="0 0 342.357 342.357">
                                <polygon points="290.04,33.286 118.861,204.427 52.32,137.907 0,190.226 118.862,309.071 342.357,85.606 " />
                            </svg> :
                            <svg width="15" height="15" fill="currentColor" className="absolute text-red-500 right-2 bottom-3" viewBox="0 0 1792 1792">
                                <path d="M1024 1375v-190q0-14-9.5-23.5t-22.5-9.5h-192q-13 0-22.5 9.5t-9.5 23.5v190q0 14 9.5 23.5t22.5 9.5h192q13 0 22.5-9.5t9.5-23.5zm-2-374l18-459q0-12-10-19-13-11-24-11h-220q-11 0-24 11-10 7-10 21l17 457q0 10 10 16.5t24 6.5h185q14 0 23.5-6.5t10.5-16.5zm-14-934l768 1408q35 63-2 126-17 29-46.5 46t-63.5 17h-1536q-34 0-63.5-17t-46.5-46q-37-63-2-126l768-1408q17-31 47-49t65-18 65 18 47 49z">
                                </path>
                            </svg>}
                    </div>
                    <div className="absolute border border-slate-600 w-full bottom-0"></div>
                </div>
                <div className="flex gap-4 justify-evenly mt-8">
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
                    <button onClick={browseBtnClick} type="button" className="py-2 px-4 flex gap-2 justify-center items-center  bg-red-500 hover:bg-red-700 focus:ring-red-500 focus:ring-offset-red-200 text-white transition ease-in duration-100 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg">
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
                    <div className="flex items-center mt-8 flex-1">
                        <h1 className={["transition-color duration-200 text-lg flex-1 text-center", !ignoreSubDirs && "text-green-400"].join(' ')}>Include subdirectories</h1>
                        <div className="flex justify-center items-center">
                            <div className="relative inline-block w-10 select-none">
                                <input type="checkbox" onChange={(e) => setIgnoreSubDirs(e.target.checked)} name="toggle" id="ignoreSubDirs" className="outline-none focus:outline-none right-4 checked:right-0 duration-100 ease-in absolute block w-6 h-6 rounded-full bg-slate-300 border-4 border-slate-400 appearance-none cursor-pointer" />
                                <label htmlFor="ignoreSubDirs" className="block overflow-hidden h-6 rounded-full bg-slate-500 cursor-pointer">
                                </label>
                            </div>
                        </div>
                        <h1 className={["transition-color duration-200 text-lg flex-1 text-center", ignoreSubDirs && "text-green-400"].join(' ')}>Ignore subdirectories</h1>
                    </div>
                </div>
                <div className="flex items-center gap-4 mt-8">
                    <h1 className="text-lg">Is this a conventional show?</h1>
                    <div className="-ml-2 relative">
                        <svg onMouseEnter={() => setConventionalShowTooltip(true)} onMouseLeave={() => setConventionalShowTooltip(false)} fill="currentColor" className="cursor-pointer w-5 h-5 fill-slate-400 right-2 bottom-3" viewBox="0 0 36 36">
                            <path d="M18,2A16,16,0,1,0,34,18,16,16,0,0,0,18,2Zm-.22,25.85a1.65,1.65,0,1,1,1.65-1.65A1.65,1.65,0,0,1,17.78,27.85Zm1.37-8.06v1.72a1.37,1.37,0,0,1-1.3,1.36h-.11a1.34,1.34,0,0,1-1.39-1.3c0-.44,0-2.76,0-2.76a1.19,1.19,0,0,1,1.12-1.31c1.57-.12,4.18-.7,4.18-3.25,0-1.83-1.41-3.07-3.43-3.07a5.31,5.31,0,0,0-4,1.92,1.36,1.36,0,0,1-2.35-.9,1.43,1.43,0,0,1,.43-1,7.77,7.77,0,0,1,6-2.69c3.7,0,6.28,2.3,6.28,5.6C24.58,17.16,22.61,19.2,19.15,19.79Z"></path>
                            <rect x="0" y="0" width="36" height="36" fillOpacity="0" />
                        </svg>
                        <div className={["px-1 py-2 bg-opacity-80 rounded-md bg-slate-700 absolute w-48 text-center bottom-full left-1/2 -translate-x-1/2 -translate-y-1 text-xs transition-opacity duration-300", conventionalShowTooltip ? "opacity-100" : "opacity-0"].join(' ')}>
                            Whether this show consists of seasons and episodes
                        </div>
                    </div>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none">
                        <input type="checkbox" checked={isConventionalShow} onChange={(e) => setIsConventionalShow(e.target.checked)} name="toggle" id="conventionalShow" className="outline-none focus:outline-none right-4 checked:right-0 checked:bg-green-300 duration-100 ease-in absolute block w-6 h-6 rounded-full bg-slate-300 border-4 border-slate-400 appearance-none cursor-pointer" />
                        <label htmlFor="conventionalShow" className="block overflow-hidden h-6 rounded-full bg-slate-500 cursor-pointer">
                        </label>
                    </div>
                </div>
                <div className="flex items-center gap-4 mt-4">
                    <h1 className="text-lg">Extract video info from file path?</h1>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none">
                        <input checked={showRegSection} type="checkbox" onChange={(e) => setShowRegSection(e.target.checked)} name="toggle" id="showSection" className="outline-none focus:outline-none right-4 checked:right-0 checked:bg-green-300 duration-100 ease-in absolute block w-6 h-6 rounded-full bg-slate-300 border-4 border-slate-400 appearance-none cursor-pointer" />
                        <label htmlFor="showSection" className="block overflow-hidden h-6 rounded-full bg-slate-500 cursor-pointer">
                        </label>
                    </div>
                </div>
                <div className="mt-4">
                    <RegExtractContext.Consumer>
                        {([regExtract, setRegExtract]) => showRegSection && <RegExtractSection dirPath={dirPath} fileExtensions={fileExtensions} ignoreSubDirs={ignoreSubDirs} isConventionalShow={isConventionalShow} regExtract={regExtract} setRegExtract={setRegExtract} />}
                    </RegExtractContext.Consumer>
                </div>
                <div className="flex items-center justify-center mt-6">
                    <button onClick={() => btnAddShow()} type="button" className="py-2 px-4 flex gap-2 justify-center items-center  bg-green-500 fill-green-500 hover:bg-green-600 hover:fill-green-600 focus:ring-green-500 focus:ring-offset-green-200 text-white transition ease-in duration-100 text-center text-2xl font-medium shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg">
                        {isAddingShow ?
                            <>
                                <div className="w-6 h-6 m-auto flex gap-4">
                                    <Spinner white />
                                </div>
                                Adding show...
                            </> :
                            <>
                                <svg role="add" className="inline h-5 w-5 dark:fill-white"
                                    viewBox="0 0 60.364 60.364" fill="none">
                                    <path d="M54.454,23.18l-18.609-0.002L35.844,5.91C35.845,2.646,33.198,0,29.934,0c-3.263,0-5.909,2.646-5.909,5.91v17.269
		L5.91,23.178C2.646,23.179,0,25.825,0,29.088c0.002,3.264,2.646,5.909,5.91,5.909h18.115v19.457c0,3.267,2.646,5.91,5.91,5.91
		c3.264,0,5.909-2.646,5.91-5.908V34.997h18.611c3.262,0,5.908-2.645,5.908-5.907C60.367,25.824,57.718,23.178,54.454,23.18z"/>
                                </svg>
                                Add the show!
                            </>}
                    </button>
                </div>
                {isAddingShow && <div className="text-center w-full mt-2 text-sm italic text-slate-500">Depending on the size of the show, this may take a few seconds</div>}
            </div >
        </RegExtractContext.Provider>
    </FileExtensionsContext.Provider>
}

function FileExtensionsDropdown(): JSX.Element {
    const [dropdownActive, setDropdownActive] = React.useState(false);
    const options = ['mkv', 'mp4', 'mov', 'avi', 'flv', 'wmv', 'avchd', 'webm', 'mpeg-4'];

    const toggleOption: any = (option: string, fileExtensions: string[], setFileExtensions: Function) => {
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

function RegExtractSection({ dirPath, fileExtensions, ignoreSubDirs, isConventionalShow, regExtract, setRegExtract }: { dirPath: string, fileExtensions: string[], ignoreSubDirs: boolean, isConventionalShow: boolean, regExtract: RegExtractConfig, setRegExtract: Function }): JSX.Element {
    const [regexString, setRegexString] = React.useState<string>(regExtract.regex ? deserializeRegexPretty(regExtract.regex) : '');
    const [seasonGroup, setSeasonGroup] = React.useState<number>(regExtract.matchingGroups.season);
    const [episodeGroup, setEpisodeGroup] = React.useState<number>(regExtract.matchingGroups.episode);
    const [titleGroup, setTitleGroup] = React.useState<number>(regExtract.matchingGroups.title);
    const [showTitleReplace, setShowTitleReplace] = React.useState<boolean>(regExtract.titleReplace.searchValue !== null && regExtract.titleReplace.searchValue.toString() !== /(?:)/.toString());
    const [searchValue, setSearchValue] = React.useState<string>(regExtract.titleReplace.searchValue ? deserializeRegexPretty(regExtract.titleReplace.searchValue) : '');
    const [replaceValue, setReplaceValue] = React.useState<string>(regExtract.titleReplace.replaceValue || '');
    const [examplePath, setExamplePath] = React.useState<string>('');
    const [examplePathLoading, setExamplePathLoading] = React.useState<boolean>(false);
    const [buttonText, setButtonText] = React.useState<string>('Generate example');

    React.useEffect(() => {
        setRegExtract({ ...regExtract, matchingGroups: { season: seasonGroup, episode: episodeGroup, title: titleGroup } });
    }, [seasonGroup, episodeGroup, titleGroup]);

    function changeRegexString(newRegexString: string): any {
        setRegexString(newRegexString);
        try {
            const regex: RegExp = new RegExp(newRegexString);
            setRegExtract({ ...regExtract, regex });
        } catch (err) {
            console.error(err);
        }
    }

    function changeSearchValue(newSearchValue: string): any {
        setSearchValue(newSearchValue);
        try {
            const regex: RegExp = new RegExp(newSearchValue, 'g');
            setRegExtract({ ...regExtract, titleReplace: { ...regExtract.titleReplace, searchValue: regex } });
        } catch (err) {
            console.error(err);
        }
    }

    function changeReplaceValue(newReplaceValue: string): any {
        setReplaceValue(newReplaceValue);
        setRegExtract({ ...regExtract, titleReplace: { ...regExtract.titleReplace, replaceValue: newReplaceValue } });
    }

    return <div className="pl-6 file:flex flex-col border-l-4 border-slate-500 bg-slate-700 p-2 font-jetbrains">
        <div className="mt-2 flex items-center gap-4">
            <button type="button" onClick={() => {
                setExamplePath('');
                setExamplePathLoading(true);
                window.localtubeAPI.getRandomFileFromDir(dirPath, { fileExtensions, ignoreSubDirs, regExtract } as FileConfig).then(
                    (exmplPath) => {
                        if (exmplPath !== null && exmplPath !== undefined) {
                            setExamplePath(exmplPath.toString());
                        }
                    },
                    (error) => console.error(error),
                ).finally(() => setExamplePathLoading(false));
                setButtonText('Different example')
            }} className="flex-1 py-2 px-4 flex gap-2 justify-center items-center  bg-purple-600 hover:bg-purple-700 focus:ring-purple-500 focus:ring-offset-purple-200 text-white transition ease-in duration-100 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg">
                {buttonText}
            </button>
            <div className="relative" style={{ flex: 5 }}>
                <p className="text-sm break-all overflow-hidden select-text">{examplePath.length ? `"${examplePath}"` : ''}</p>
                {examplePathLoading && <div className="absolute left-0 top-1/2 w-6 h-6 -translate-y-1/2 flex items-center">
                    <Spinner></Spinner>
                    <p className="text-xs">Loading...</p>
                </div>}
            </div>
        </div>
        <div className="mt-4 flex gap-4 items-center">
            <p className="text-base">Regex:</p>
            <div className="w-full relative">
                <RegexInput flags="" placeholder="Regular expression" value={regexString} onChange={(e: any) => changeRegexString(e.target.value)}></RegexInput>
            </div>
        </div>
        <div className="mt-2">
            <h1 className="text-base w-full">Matching groups:</h1>
            <div className="px-4 flex flex-col w-full relative text-white text-sm">
                <div className="flex items-center gap-4 mt-1 relative w-fit" style={{ opacity: isConventionalShow ? 1 : 0.5, pointerEvents: isConventionalShow ? 'all' : 'none' }}>
                    <p className="w-24">Season</p>
                    <NumberSelect numbers={[0, 1, 2, 3, 4, 5]} currentNumber={seasonGroup} setCurrentNumber={setSeasonGroup} />
                    {seasonGroup !== undefined && seasonGroup !== null && examplePath && examplePath.length && <p className="ml-8 text-slate-400">{examplePath.match(regExtract.regex) && examplePath.match(regExtract.regex)[seasonGroup]}</p>}
                </div>
                <div className="flex items-center gap-4 mt-1">
                    <p className="w-24">Episode</p>
                    <NumberSelect numbers={[0, 1, 2, 3, 4, 5]} currentNumber={episodeGroup} setCurrentNumber={setEpisodeGroup} />
                    {episodeGroup !== undefined && episodeGroup !== null && examplePath && examplePath.length && <p className="ml-8 text-slate-400">{examplePath.match(regExtract.regex) && examplePath.match(regExtract.regex)[episodeGroup]}</p>}
                </div>
                <div className="flex items-center gap-4 mt-1">
                    <p className="w-24">Title</p>
                    <NumberSelect numbers={[0, 1, 2, 3, 4, 5]} currentNumber={titleGroup} setCurrentNumber={setTitleGroup} />
                    {titleGroup !== undefined && titleGroup !== null && examplePath && examplePath.length && <p className="ml-8 text-slate-400">{examplePath.match(regExtract.regex) && examplePath.match(regExtract.regex)[titleGroup]?.replace(regExtract.titleReplace.searchValue, regExtract.titleReplace.replaceValue)}</p>}
                </div>
            </div>
        </div>
        <div className="mt-4">
            {/* <h1 className="text-base w-full">Mutate title?</h1> */}
            <div className="flex items-center gap-4">
                <h1 className="text-base">Mutate title?</h1>
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                    <input type="checkbox" checked={showTitleReplace} onChange={(e) => setShowTitleReplace(e.target.checked)} name="toggle" id="showTitleReplace" className="outline-none focus:outline-none right-4 checked:right-0 checked:bg-green-300 duration-100 ease-in absolute block w-6 h-6 rounded-full bg-slate-300 border-4 border-slate-400 appearance-none cursor-pointer" />
                    <label htmlFor="showTitleReplace" className="block overflow-hidden h-6 rounded-full bg-slate-500 cursor-pointer">
                    </label>
                </div>
            </div>
            {showTitleReplace && <div className="px-4 flex flex-col w-full relative text-white text-sm">
                <div className="flex items-center gap-4 mt-1">
                    <p>In title, replace</p>
                    <div className="relative">
                        <RegexInput flags="g" placeholder="Regex search" value={searchValue} onChange={(e: any) => changeSearchValue(e.target.value)}></RegexInput>
                    </div>
                    <p>with</p>
                    <input type="text" value={replaceValue} onChange={(e) => changeReplaceValue(e.target.value)} className="text-sm w-full rounded-lg border-transparent flex-1 appearance-none border border-gray-300 py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent" name="pseudo" spellCheck="false" placeholder="nothing" />
                </div>
            </div>}
        </div>
    </div>
}

function RegexInput({ flags, placeholder, value, onChange }: { flags: string, placeholder: string, value: string, onChange: any }): JSX.Element {
    return <>
        <input value={value} onChange={onChange} type="text" className="text-gray-700 text-sm px-5 w-full rounded-lg border-transparent flex-1 appearance-none border border-gray-300 py-2 bg-white placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent" name="pseudo" spellCheck="false" placeholder={placeholder} />
        <p className="absolute bottom-1.5 -translate-y-px left-2.5 text-base text-gray-400">/</p>
        <p className="absolute bottom-1.5 -translate-y-px right-2.5 text-base text-gray-400">/{flags}</p>
    </>
}

function NumberSelect({ numbers, currentNumber, setCurrentNumber }: { numbers: number[], currentNumber: number, setCurrentNumber: Function }): JSX.Element {
    return <div className="flex p-1 gap-1 bg-slate-500 rounded-sm">
        {numbers.map(number => <div key={number} onClick={() => setCurrentNumber(number)} className={["px-4 rounded-sm cursor-pointer transition-colors duration-100", currentNumber === number ? "bg-slate-700" : "bg-slate-600"].join(' ')}>
            {number}
        </div>)}
    </div>
}