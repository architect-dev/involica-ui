import { useRef, useEffect, useState } from "react";
import { throttle } from "lodash";

export default function useVisibility<Element extends HTMLElement>(): [boolean, React.RefObject<Element>] {
    const [isVisible, setIsVisible] = useState(false);
    const currentElement = useRef<Element>();

    const onScroll = throttle(() => {
        if (!currentElement.current) {
        setIsVisible(false);
        return;
        }
        const { top } = currentElement.current.getBoundingClientRect();
        setIsVisible((top + 200) >= 0 && top <= window.innerHeight);
    }, 150);

    useEffect(() => {
        document.addEventListener('scroll', onScroll, true);
        return () => document.removeEventListener('scroll', onScroll, true);
    });

    return [isVisible, currentElement];
}