import {useCallback, useRef, useState} from "react";

export const useInView = <T extends Element>(options?: IntersectionObserverInit) => {
    const [inView, setInView] = useState(false);
    const observerRef = useRef<IntersectionObserver | null>(null);

    const ref = useCallback((element: T | null) => {
        observerRef.current?.disconnect();
        observerRef.current = null;

        if (!element) {
            return;
        }

        const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), options);
        observer.observe(element);

        return () => {
            observer.disconnect();
            setInView(false);
        };
    }, [options?.root, options?.rootMargin, options?.threshold]);

    return [ref, inView];
};