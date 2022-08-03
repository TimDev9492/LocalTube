import React, { useRef, useEffect } from "react";

/**
 * Hook that alerts clicks outside of the passed ref
 */
function useOutsideAlerter(ref: any, onOutsideClick: Function) {
    useEffect(() => {
        /**
         * Alert if clicked on outside of element
         */
        function handleClickOutside(event: any) {
            if (ref.current && !ref.current.contains(event.target)) {
                onOutsideClick();
            }
        }
        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref]);
}

/**
 * Component that alerts if you click outside of it
 */
export default function DetectOutsideClick({ children, onOutsideClick }: { children: any, onOutsideClick: Function }) {
    const wrapperRef = useRef(null);
    useOutsideAlerter(wrapperRef, onOutsideClick);

    return <div ref={wrapperRef}>{children}</div>;
}