import * as React from "react";
import { compareAsNumbers } from "../../../frontend/utils";
import { LocalSeason, LocalShow, LocalShowContent } from "../../../backend/structure";
import Spinner from "../Spinner";
import { VideoCard } from "../VideoCard";
import { PathLike } from "original-fs";

const OpenItemsContext: React.Context<Set<string>> = React.createContext<Set<string>>(new Set<string>());

export function ShowAccordion({ show, activeVideoPath, setActiveVideoByPath }: { show: LocalShow, activeVideoPath: PathLike, setActiveVideoByPath: Function }): JSX.Element {
    const [isAnimated, setAnimated] = React.useState<boolean>(false);

    return <div className="max-w-6xl h-full divide-y-2" >
        {show ? (
            show.isConventionalShow ?
                Object.keys(show.content).sort(compareAsNumbers).map((seasonNo: string) => <AccordionItem key={seasonNo} index={seasonNo} isAnimated={isAnimated} setAnimated={setAnimated} showSeason={(show.content as LocalShowContent)[seasonNo]} activeVideoPath={activeVideoPath} setActiveVideoByPath={setActiveVideoByPath}>
                    Season {parseInt(seasonNo)}
                </AccordionItem>) :
                <h1>NOT IMPLEMENTED YET!</h1>
        ) :
            <Spinner />}
    </div>;
}

function AccordionItem({ index, children, isAnimated, setAnimated, showSeason, activeVideoPath, setActiveVideoByPath }: { index: string, children: any, isAnimated: boolean, setAnimated: Function, showSeason: LocalSeason, activeVideoPath: PathLike, setActiveVideoByPath: Function }): JSX.Element {
    const self = React.useRef();
    const [isLoaded, setLoaded] = React.useState<boolean>(false);
    const [offsetHeight, setOffsetHeight] = React.useState<number>(null);
    const openItems = React.useContext(OpenItemsContext);

    let animationTimeout: NodeJS.Timeout = null;
    const animationTimeMs = 200;

    React.useEffect(() => {
        if (self.current && (self.current as any).offsetHeight !== undefined) {
            setTimeout(() => setLoaded(true), 10);
            setOffsetHeight((self.current as any).offsetHeight);
        }
    }, [self.current]);

    window.addEventListener('resize', () => self.current && setOffsetHeight((self.current as any).offsetHeight));

    const onClickEvent = () => {
        if (animationTimeout) clearTimeout(animationTimeout);
        setAnimated(true);
        animationTimeout = setTimeout(() => {
            setAnimated(false);
        }, animationTimeMs);
        openItems.has(index) ? openItems.delete(index) : openItems.add(index);
    };

    return <>
        <div className={["flex flex-col text-white overflow-hidden -my-px border-slate-400 select-none", !isLoaded && "invisible"].join(' ')}>
            <div className="cursor-pointer w-full flex justify-between items-center dark:bg-slate-800 p-6 z-10" onClick={onClickEvent} >
                <h1 className="font-medium text-2xl flex">{children}<p className="ml-4 font-extralight">({Object.keys(showSeason).length} episodes)</p></h1>
                <svg role="arrow" className={["inline h-6 w-6 dark:fill-slate-300 dark:group-hover:fill-white transition-transform ease-linear", openItems.has(index) && "-scale-y-100"].join(' ')}
                    viewBox="0 0 330 330" fill="none">
                    <path id="XMLID_225_" d="M325.607,79.393c-5.857-5.857-15.355-5.858-21.213,0.001l-139.39,139.393L25.607,79.393
	c-5.857-5.857-15.355-5.858-21.213,0.001c-5.858,5.858-5.858,15.355,0,21.213l150.004,150c2.813,2.813,6.628,4.393,10.606,4.393
	s7.794-1.581,10.606-4.394l149.996-150C331.465,94.749,331.465,85.251,325.607,79.393z"/>
                </svg>
            </div>
            <div ref={self} className={["w-full grid grid-cols-3 grid-flow-row-dense gap-4 p-8 dark:bg-slate-600", "flex", "flex-wrap", "justify-start", !isLoaded && "-translate-y-full"].join(' ')} style={{ transition: isAnimated ? `margin ${animationTimeMs / 1000.0}s linear` : 'margin 0s', marginBottom: (self.current && !openItems.has(index)) ? `-${offsetHeight}px` : '0px' }}>
                {Object.keys(showSeason).sort(compareAsNumbers).map((episodeNo: string, index: number) => <VideoCard key={episodeNo} gridCol={(index % 3) + 1} video={showSeason[episodeNo]} episodeNo={episodeNo} activeVideoPath={activeVideoPath} setActiveVideoByPath={setActiveVideoByPath}></VideoCard>)}
            </div>
        </div >
    </>
}