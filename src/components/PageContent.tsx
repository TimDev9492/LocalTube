import * as React from 'react';
import * as ReactDOM from 'react-dom';

export default function PageContent(): JSX.Element {
    return <div className="dark:bg-slate-700 flex items-center justify-center flex-1 p-16">
        <ShowAccordion />
    </div>
}

const OpenItemsContext: React.Context<Set<number>> = React.createContext<Set<number>>(new Set<number>());

function ShowAccordion(): JSX.Element {
    const [isAnimated, setAnimated] = React.useState<boolean>(false);

    return <div className="w-4/5 rounded">
        <AccordionItem index={0} isAnimated={isAnimated} setAnimated={setAnimated}>Season 1</AccordionItem>
        <AccordionItem index={1} isAnimated={isAnimated} setAnimated={setAnimated}>Season 2</AccordionItem>
        <AccordionItem index={2} isAnimated={isAnimated} setAnimated={setAnimated}>Season 3</AccordionItem>
        <AccordionItem index={3} isAnimated={isAnimated} setAnimated={setAnimated}>Season 4</AccordionItem>
        <AccordionItem index={4} isAnimated={isAnimated} setAnimated={setAnimated}>Season 5</AccordionItem>
    </div>
}

function AccordionItem({ index, children, isAnimated, setAnimated }: { index: number, children: any, isAnimated: boolean, setAnimated: Function }): JSX.Element {
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

    return <div className="flex flex-col text-white overflow-hidden">
        <div className="w-full flex justify-between items-center dark:bg-slate-800 py-2 px-4 z-10" onClick={onClickEvent}>
            <h1 className="font-medium text-2xl">{children}</h1>
            <h1 className="text-6xl">{ openItems.has(index) ? '-' : '+' }</h1>
        </div>
        <div ref={self} className={["w-full p-4 dark:bg-slate-600", !isLoaded && "-translate-y-full"].join(' ')} style={{ transition: isAnimated ? `margin ${animationTimeMs / 1000.0}s linear` : 'margin 0s', marginBottom: (self.current && !openItems.has(index)) ? `-${offsetHeight}px` : '0px' }}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi reiciendis corporis laboriosam sint. Recusandae quisquam sapiente vel quasi a obcaecati rerum dicta. Rem quasi, unde beatae quia ea, aspernatur doloribus consectetur eaque voluptatem nam possimus nostrum temporibus tenetur iure. Ad dolorum dolore maiores! Explicabo quisquam fuga obcaecati assumenda expedita neque sed fugit deleniti nisi! Mollitia nesciunt laboriosam illum repellat vitae doloribus optio voluptate unde reprehenderit? Debitis aut iste consectetur quis, voluptates similique nam vel fugiat. Nulla molestiae officiis cum quia impedit omnis animi minima eveniet illum, nisi molestias tenetur dolore enim non error odit. Optio veritatis consequuntur ducimus, ratione ipsam facilis aliquid, cum, maiores ad saepe voluptates nulla quos obcaecati. Cum perferendis architecto, recusandae doloremque et doloribus praesentium, repellendus incidunt rerum odit obcaecati dolore nulla similique modi deserunt saepe. Vero consectetur facilis facere possimus qui, temporibus minima pariatur, omnis ducimus magnam sunt obcaecati eaque sint accusantium harum nobis optio architecto rerum tenetur quod, saepe praesentium? Placeat, saepe id. Ipsam, eaque deserunt ab asperiores inventore dolores sit eum sed! Sunt repellat sit nemo provident distinctio quod nam eius temporibus quis iure ullam aspernatur, dolorum dolor itaque consequuntur aliquam ea facere! Ex, excepturi saepe pariatur eaque quo non voluptas? Consectetur rem modi itaque quo, quibusdam culpa adipisci non, est sapiente cupiditate fugit minus odio? Explicabo eius corporis magnam. Recusandae beatae nam veniam, rem, excepturi nemo accusamus similique possimus eveniet illum quod porro repudiandae nihil placeat autem obcaecati, nulla fuga sunt alias tempore nobis maiores omnis. Unde consequuntur minima omnis a magni eos voluptatum cupiditate possimus illo ab quae corporis reprehenderit exercitationem, quas nemo quam saepe earum praesentium, eum quibusdam fuga reiciendis dolorem nihil maiores. Nulla placeat reprehenderit culpa temporibus ex quae illum assumenda, recusandae, blanditiis quo, commodi similique alias? Modi nam libero harum quaerat dolore, vitae repellendus! Cupiditate recusandae atque necessitatibus ratione.
        </div>
    </div>
}