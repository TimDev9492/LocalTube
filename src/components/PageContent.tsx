import * as React from 'react';
import { PropsWithChildren } from 'react';

export default function PageContent(): JSX.Element {
    return <div className="dark:bg-slate-700 flex items-center justify-center flex-1">
        <ShowAccordion />
    </div>
}

function ShowAccordion(): JSX.Element {
    const [accordionIndex, setAccordionIndex] = React.useState(null);

    return <div className="w-4/5 rounded">
        <AccordionItem index={0} setAccordionIndex={setAccordionIndex} accordionIndex={accordionIndex}>Season 1</AccordionItem>
        <AccordionItem index={1} setAccordionIndex={setAccordionIndex} accordionIndex={accordionIndex}>Season 2</AccordionItem>
    </div>
}

function AccordionItem({ index, setAccordionIndex, accordionIndex, children }: { index: number, setAccordionIndex: Function, accordionIndex: number, children: any }): JSX.Element {
    return <div className="flex flex-col text-white overflow-hidden">
        <div className="w-full flex justify-between items-center dark:bg-slate-800 py-2 px-4 z-10" onClick={() => setAccordionIndex(accordionIndex === index ? null : index)}>
            <h1 className="font-medium text-2xl">{children}</h1>
            <h1 className="text-6xl">+</h1>
        </div>
        <div className={[...["w-full", "p-4", "dark:bg-slate-600", "transition-transform ease-linear"], accordionIndex !== index && "-translate-y-full"].join(' ')}>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quas quo aperiam soluta unde tenetur iure
            facilis non commodi, culpa distinctio explicabo ex sint voluptatibus, atque similique obcaecati ea
            dolorem quam praesentium eveniet voluptatem beatae assumenda. Ratione asperiores voluptatum quam
            maiores maxime harum eum voluptates molestias sunt molestiae nulla tempora aut est praesentium,
            enim quidem minus rerum cum corporis similique? Praesentium hic placeat aliquam porro maiores.
            Iste, fugiat, consectetur dolor dicta repellendus dolores architecto sequi vero, alias natus
            veritatis exercitationem temporibus odit assumenda numquam esse optio laborum eaque dignissimos
            hic. Doloribus in cumque tenetur qui culpa error vel nemo porro inventore.
        </div>
    </div>
}