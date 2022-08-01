import * as React from "react";
import { compareAsNumbers } from "../../../frontend/utils";
import { LocalSeason, LocalShow, LocalShowContent } from "../../../backend/structure";
import Spinner from "../Spinner";
import { VideoCard } from "../VideoCard";
import { PathLike } from "original-fs";

const OpenItemsContext: React.Context<Set<string>> = React.createContext<Set<string>>(new Set<string>());

export function ShowAccordion({ show, activeVideoPath, setActiveVideoByPath }: { show: LocalShow, activeVideoPath: PathLike, setActiveVideoByPath: Function }): JSX.Element {
    const [isAnimated, setAnimated] = React.useState<boolean>(false);

    return <div className="w-4/5 rounded h-full" >
        {show ? (
            Object.keys(show.content).sort(compareAsNumbers).map((seasonNo: string) => <AccordionItem key={seasonNo} index={seasonNo} isAnimated={isAnimated} setAnimated={setAnimated} showSeason={(show.content as LocalShowContent)[seasonNo]} activeVideoPath={activeVideoPath} setActiveVideoByPath={setActiveVideoByPath}>
                Season {parseInt(seasonNo)}
            </AccordionItem>)
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
    const animationTimeMs = 100;

    React.useEffect(() => {
        if (self.current && (self.current as any).offsetHeight !== undefined) {
            setLoaded(true);
            setOffsetHeight((self.current as any).offsetHeight);
        }
        // const worker = new Worker();
        // worker.onmessage()
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

    return <div className="flex flex-col text-white overflow-hidden -my-px">
        <div className="cursor-pointer w-full flex justify-between items-center dark:bg-slate-800 py-2 px-4 z-10" onClick={onClickEvent}>
            <h1 className="font-medium text-2xl">{children}</h1>
            <h1 className="text-6xl">{openItems.has(index) ? '-' : '+'}</h1>
        </div>
        <div ref={self} className={["w-full grid grid-cols-3 grid-flow-row-dense gap-4 p-8 dark:bg-slate-600", "flex", "flex-wrap", "justify-start", !isLoaded && "-translate-y-full"].join(' ')} style={{ transition: isAnimated ? `margin ${animationTimeMs / 1000.0}s linear` : 'margin 0s', marginBottom: (self.current && !openItems.has(index)) ? `-${offsetHeight}px` : '0px' }}>
            {Object.keys(showSeason).sort(compareAsNumbers).map((episodeNo: string, index: number) => <VideoCard key={episodeNo} gridCol={(index % 3) + 1} video={showSeason[episodeNo]} episodeNo={episodeNo} activeVideoPath={activeVideoPath} setActiveVideoByPath={setActiveVideoByPath}></VideoCard>)}
        </div>
    </div>
}